import { Navbar } from "@/components/Navbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/auth/useAuth";
import { useTheme } from "@/theme/ThemeContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { backgroundColor, textColor, borderColor, secondaryTextColor } =
    useTheme();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [currentMode, setCurrentMode] = useState<"login" | "signup">(
    mode === "signup" ? "signup" : "login"
  );
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Check for email verification callback in URL hash
  useEffect(() => {
    let ignore = false;
    const hash = window.location.hash;
    if (
      hash &&
      (hash.includes("access_token") ||
        hash.includes("type=signup") ||
        hash.includes("type=recovery"))
    ) {
      setVerificationState("verifying");

      // Supabase will automatically process the hash fragment because detectSessionInUrl is true
      // We just need to wait for the session to be established
      const checkSession = async () => {
        try {
          // Wait a bit for Supabase to process the hash
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (ignore) return;

          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (ignore) return;

          if (error) {
            if (!ignore) {
              setVerificationState("error");
              setErrorMessage(
                error.message ||
                  "Failed to verify email. The link may have expired."
              );
              // Clean up URL
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search
              );
            }
            return;
          }

          if (session) {
            if (!ignore) {
              setVerificationState("success");
              // Clean up URL
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search
              );
              // Redirect will happen automatically via the user effect below
            }
          } else {
            if (!ignore) {
              setVerificationState("error");
              setErrorMessage(
                "Email verification failed. Please try signing up again."
              );
              // Clean up URL
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search
              );
            }
          }
        } catch (err) {
          if (!ignore) {
            setVerificationState("error");
            setErrorMessage(
              "An error occurred during verification. Please try again."
            );
            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search
            );
          }
        }
      };

      checkSession();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (user && verificationState === "success") {
      // Small delay to show success message before redirect
      const timer = setTimeout(() => {
        navigate("/challenges");
      }, 1500);
      return () => clearTimeout(timer);
    } else if (user) {
      navigate("/challenges");
    }
  }, [user, navigate, verificationState]);

  useEffect(() => {
    setCurrentMode(mode === "signup" ? "signup" : "login");
  }, [mode]);

  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: "JetBrains Mono, monospace",
  };

  // Show verification states
  if (verificationState === "verifying") {
    return (
      <div className="min-h-screen flex flex-col" style={themeStyle}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="w-full max-w-md">
            <div
              className="rounded-lg border-2 p-8"
              style={{ borderColor: borderColor }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <div
                    className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "#7F5539" }}
                  ></div>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={themeStyle}>
                  Verifying your email...
                </h1>
                <p
                  style={{
                    color: secondaryTextColor,
                    fontFamily: themeStyle.fontFamily,
                  }}
                >
                  Please wait while we confirm your email address.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (verificationState === "success") {
    return (
      <div className="min-h-screen flex flex-col" style={themeStyle}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="w-full max-w-md">
            <div
              className="rounded-lg border-2 p-8"
              style={{ borderColor: borderColor }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    style={{ color: "#2E7D32" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={themeStyle}>
                  Email verified successfully!
                </h1>
                <p
                  style={{
                    color: secondaryTextColor,
                    fontFamily: themeStyle.fontFamily,
                  }}
                >
                  Your email has been confirmed. Redirecting you to
                  challenges...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (verificationState === "error") {
    return (
      <div className="min-h-screen flex flex-col" style={themeStyle}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="w-full max-w-md">
            <div
              className="rounded-lg border-2 p-8"
              style={{ borderColor: "#B91C1C" }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    style={{ color: "#B91C1C" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={themeStyle}>
                  Verification failed
                </h1>
                <p
                  className="mb-6"
                  style={{
                    color: secondaryTextColor,
                    fontFamily: themeStyle.fontFamily,
                  }}
                >
                  {errorMessage ||
                    "The verification link may have expired or is invalid."}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/auth?mode=signup"
                    className="inline-block px-6 py-2 rounded-lg font-semibold"
                    style={{ backgroundColor: "#7F5539", color: "#ffffff" }}
                  >
                    Try signing up again
                  </Link>
                  <div>
                    <Link
                      to="/"
                      className="text-sm underline"
                      style={{ color: textColor }}
                    >
                      Back to home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">
          <div
            className="rounded-lg border-2 p-8"
            style={{ borderColor: borderColor }}
          >
            <h1 className="text-3xl font-bold mb-2" style={themeStyle}>
              {currentMode === "login" ? "Log in" : "Sign up"}
            </h1>
            <p
              className="mb-6"
              style={{
                color: secondaryTextColor,
                fontFamily: themeStyle.fontFamily,
              }}
            >
              {currentMode === "login"
                ? "Welcome back! Sign in to continue learning."
                : "Create an account to start learning data structures and algorithms."}
            </p>
            {currentMode === "login" ? (
              <LoginForm
                onSuccess={() => navigate("/challenges")}
                onSwitchToSignup={() => {
                  setCurrentMode("signup");
                  navigate("/auth?mode=signup", { replace: true });
                }}
              />
            ) : (
              <SignupForm
                onSuccess={() => navigate("/challenges")}
                onSwitchToLogin={() => {
                  setCurrentMode("login");
                  navigate("/auth?mode=login", { replace: true });
                }}
              />
            )}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm underline"
                style={{ color: textColor }}
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
