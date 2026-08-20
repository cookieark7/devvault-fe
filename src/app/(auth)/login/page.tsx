"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ identifier: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
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
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Sign in to your vault
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
            onChange={(e) => setPassword(e.target.value)}
            required
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
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-accent hover:underline font-medium"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
