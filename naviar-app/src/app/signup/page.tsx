import Link from "next/link";
import { signup } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="shell">
      <h1>Create account</h1>
      <p className="sub">NAVIAR</p>

      <AuthForm action={signup} mode="signup" />

      <p className="alt">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
