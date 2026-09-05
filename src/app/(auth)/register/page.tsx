"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import FormAlert from "@/components/common/ui/FormAlert";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ROUTES } from "@/lib/constants/routes";
import { toAuthError } from "@/lib/utils/authErrors";

const MIN_PASSWORD = 8;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Live feedback rather than waiting for a submit to say "they don't match".
  const longEnough = password.length >= MIN_PASSWORD;
  const matches = confirmPassword.length > 0 && password === confirmPassword;
  const mismatch = confirmPassword.length > 0 && !matches;

  const canSubmit =
    email.trim() !== "" &&
    username.trim() !== "" &&
    longEnough &&
    matches &&
    !isLoading;

  const clearErrors = () => {
    if (error) setError("");
    if (Object.keys(fieldErrors).length) setFieldErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Enter your email.";
    if (!username.trim()) next.username = "Pick a username.";
    if (!longEnough) next.password = `Use at least ${MIN_PASSWORD} characters.`;
    else if (!matches) next.confirmPassword = "Passwords do not match.";
    if (Object.keys(next).length) {
      setFieldErrors(next);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: email.trim(),
        username: username.trim(),
        password,
        displayName: displayName.trim() || undefined,
      });
      router.push(ROUTES.home);
    } catch (err) {
      const mapped = toAuthError(err);
      if (mapped.field) {
        setFieldErrors({ [mapped.field]: mapped.message });
      } else {
        setError(mapped.message);
      }
      setIsLoading(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="pointer-events-auto text-text-tertiary hover:text-text-secondary transition-colors duration-100"
    >
      {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
    </button>
  );

  return (
    <>
      <div className="w-full max-w-sm bg-bg-main border border-border-base rounded-md shadow-notion-menu p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-5 h-5 bg-text-primary rounded-sm" />
          <span className="text-sm font-semibold text-text-primary ml-2">
            DevVault
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-text-primary mt-6">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Start building your developer vault
        </p>

        <FormAlert message={error} />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-6">
          <Input
            label="Display Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={displayName}
            hint="Optional"
            onChange={(e) => {
              setDisplayName(e.target.value);
              clearErrors();
            }}
          />
          <Input
            label="Username"
            type="text"
            autoComplete="username"
            placeholder="alice"
            value={username}
            error={fieldErrors.username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearErrors();
            }}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrors();
            }}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            error={fieldErrors.password}
            hint={
              !fieldErrors.password && !longEnough
                ? `At least ${MIN_PASSWORD} characters`
                : undefined
            }
            rightIcon={passwordToggle}
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrors();
            }}
          />
          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            error={mismatch ? "Passwords do not match" : fieldErrors.confirmPassword}
            rightIcon={
              matches ? (
                <Check size={15} strokeWidth={2} style={{ color: "var(--success)" }} />
              ) : undefined
            }
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearErrors();
            }}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!canSubmit}
            className="w-full"
          >
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="text-accent hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}
