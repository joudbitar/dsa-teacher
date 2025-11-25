import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useTheme } from "../../theme/ThemeContext";

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({
  onSuccess: _onSuccess,
  onSwitchToLogin,
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { textColor, backgroundColor, borderColor, secondaryTextColor } =
    useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setSuccess(false); // Reset success state

    const { error } = await signUp(email, password);

    if (error) {
      // Check if the error is about existing user
      const errorMessage = error.message?.toLowerCase() || "";
      const errorCode = error.code || (error as any).status;

      if (
        errorCode === "user_already_registered" ||
        errorMessage.includes("already registered") ||
        errorMessage.includes("user already exists") ||
        errorMessage.includes("email already") ||
        errorMessage.includes("please log in instead")
      ) {
        setError("Email is already in use");
      } else {
        setError(error.message || "An error occurred during signup");
      }
      setLoading(false);
      setSuccess(false);
    } else {
      // Only show success if there's no error
      // Supabase may return success even for duplicates when email confirmation is on,
      // but if there's no error, we assume it's a new signup
      setSuccess(true);
      setLoading(false);
      setError(null);
      // Don't auto-redirect if email confirmation is required
      // User needs to check their email first
      // onSuccess will be called manually when they click "Go to login"
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 mb-2">
          ✓ Account created successfully!
        </div>
        <div className="text-sm mb-4" style={{ color: secondaryTextColor }}>
          Please check your email to verify your account. Click the confirmation
          link in the email to activate your account.
        </div>
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="text-sm underline"
            style={{ color: textColor }}
          >
            Go to login
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: borderColor }}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: borderColor }}
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: borderColor }}
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: textColor,
          color: backgroundColor,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
      {onSwitchToLogin && (
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-sm text-center"
          style={{ color: textColor }}
        >
          Already have an account? Log in
        </button>
      )}
    </form>
  );
}
