import Link from "next/link";
import { requestPasswordReset } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";

export default function ForgotPasswordPage() {
  return (
    <main className="shell">
      <h1>Reset password</h1>
      <p className="sub">
        Enter your email and we&rsquo;ll send you a link to set a new password.
      </p>

      <AuthForm action={requestPasswordReset} mode="forgot" />

      <p className="alt">
        Remembered it? <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
