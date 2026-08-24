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
type Mode = "login" | "signup" | "forgot" | "update-password";

const SUBMIT_LABEL: Record<Mode, string> = {
  login: "Sign in",
  signup: "Create account",
  forgot: "Send reset link",
  "update-password": "Set new password",
};

export function AuthForm({
  action,
  mode,
  next,
}: {
  action: Action;
  mode: Mode;
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

      {mode !== "update-password" && (
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      )}

      {mode !== "forgot" && (
        <label className="field">
          <span>{mode === "update-password" ? "New password" : "Password"}</span>
          <input
            name="password"
            type="password"
            required
            minLength={mode === "login" ? undefined : 8}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </label>
      )}

      {mode === "update-password" && (
        <label className="field">
          <span>Confirm new password</span>
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
      )}

      {next && <input type="hidden" name="next" value={next} />}

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <Submit label={SUBMIT_LABEL[mode]} />
    </form>
  );
}
