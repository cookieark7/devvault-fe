"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, username, password, displayName });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm bg-bg-main border border-border-base rounded-md shadow-notion-menu p-8">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-5 h-5 bg-text-primary rounded-sm" />
          <span className="text-sm font-semibold text-text-primary ml-2">
            DevVault
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-text-primary mt-6">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Start building your developer vault
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 p-2.5 rounded bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input
            label="Display Name"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            label="Username"
            type="text"
            placeholder="alice"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError("");
            }}
            error={passwordError}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Create account
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
