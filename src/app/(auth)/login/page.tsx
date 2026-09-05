"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import FormAlert from "@/components/common/ui/FormAlert";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ROUTES } from "@/lib/constants/routes";
import { toAuthError } from "@/lib/utils/authErrors";
import Logo from "@/components/common/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  // The API takes an `identifier` — email OR username. The old field was
  // type="email", so browser validation blocked username logins outright.
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const canSubmit = identifier.trim().length > 0 && password.length > 0 && !isLoading;

  const clearErrors = () => {
    if (error) setError("");
    if (Object.keys(fieldErrors).length) setFieldErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!identifier.trim()) {
      setFieldErrors({ identifier: "Enter your email or username." });
      return;
    }
    if (!password) {
      setFieldErrors({ password: "Enter your password." });
      return;
    }

    setIsLoading(true);
    try {
      await login({ identifier: identifier.trim(), password });
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

  return (
    <>
      <div className="w-full max-w-sm bg-bg-main border border-border-base rounded-md shadow-notion-menu p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size={24} className="-ml-0.5" />
          <span className="text-sm font-semibold text-text-primary ml-2">
            DevVault
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-text-primary mt-6">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary mt-1">Sign in to your vault</p>

        <FormAlert message={error} />

        {/* noValidate: our messages are friendlier than the browser's bubbles. */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-6">
          <Input
            label="Email or username"
            id="identifier"
            type="text"
            autoComplete="username"
            autoFocus
            placeholder="you@example.com"
            value={identifier}
            error={fieldErrors.identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              clearErrors();
            }}
          />

          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrors();
            }}
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="pointer-events-auto text-text-tertiary hover:text-text-secondary transition-colors duration-100"
              >
                {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            }
          />

          <Link
            href="#"
            className="text-xs text-accent hover:underline self-end -mt-2"
          >
            Forgot password?
          </Link>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!canSubmit}
            className="w-full"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary mt-6">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="text-accent hover:underline font-medium">
          Create one
        </Link>
      </p>
    </>
  );
}
