import { useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, getSiteUrl } from "../lib/supabase";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth?mode=login`,
      },
    });
    
    // Check for duplicate user errors
    if (error) {
      const errorCode = (error as any).code || (error as any).status;
      const errorMessage = error.message?.toLowerCase() || '';
      
      // Check for duplicate user error codes
      if (
        errorCode === 'user_already_registered' ||
        errorCode === 422 ||
        errorMessage.includes('already registered') ||
        errorMessage.includes('user already exists') ||
        errorMessage.includes('email already')
      ) {
        return {
          error: {
            ...error,
            message: 'Email is already in use',
            code: 'user_already_registered',
          },
        };
      }
    }
    
    // When email confirmation is ON, Supabase returns success for duplicates
    // to prevent email enumeration. We detect this by checking if identities array is empty.
    // Empty identities means the email is already registered.
    if (!error && data?.user) {
      if (data.user.identities && data.user.identities.length === 0) {
        return {
          error: {
            message: 'Email is already in use',
            code: 'user_already_registered',
          } as any,
        };
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/reset-password`,
    });
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
