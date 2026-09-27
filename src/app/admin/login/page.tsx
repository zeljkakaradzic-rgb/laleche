"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const result = await login(String(form.get("email")), String(form.get("password")));

    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6">
        <h1 className="font-serif-display text-2xl text-center">Laleche Admin</h1>

        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field mt-2" />
        </div>
        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="password">
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-field mt-2"
          />
        </div>

        {error ? <p className="text-sm text-[var(--color-terracotta)]">{error}</p> : null}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Prijava..." : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
