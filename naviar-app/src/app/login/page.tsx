import Link from "next/link";
import { login } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string; error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="shell">
      <h1>Sign in</h1>
      <p className="sub">NAVIAR account</p>

      {params.checkEmail === "reset" ? (
        <p className="notice">
          If that address has an account, a reset link is on its way.
        </p>
      ) : params.checkEmail ? (
        <p className="notice">
          Check your inbox for a confirmation link, then sign in.
        </p>
      ) : null}
      {params.error === "link_invalid" && (
        <p className="notice">
          That link is invalid or has expired. Request a new one.
        </p>
      )}

      <AuthForm action={login} mode="login" next={params.next} />

      <p className="alt">
        <Link href="/forgot-password">Forgot your password?</Link>
      </p>
      <p className="alt">
        No account? <Link href="/signup">Create one</Link>
      </p>
    </main>
  );
}
