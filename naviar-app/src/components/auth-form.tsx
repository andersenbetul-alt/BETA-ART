"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? "Working…" : label}
    </button>
  );
}

type Action = (prev: string | null, data: FormData) => Promise<string | null>;

export function AuthForm({
  action,
  mode,
  next,
}: {
  action: Action;
  mode: "login" | "signup";
  next?: string;
}) {
  const [error, formAction] = useActionState<string | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="stack">
      {mode === "signup" && (
        <label className="field">
          <span>Full name</span>
          <input name="full_name" type="text" autoComplete="name" />
        </label>
      )}

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={
            mode === "signup" ? "new-password" : "current-password"
          }
        />
      </label>

      {next && <input type="hidden" name="next" value={next} />}

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <Submit label={mode === "signup" ? "Create account" : "Sign in"} />
    </form>
  );
}
