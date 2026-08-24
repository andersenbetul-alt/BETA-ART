import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="shell">
      <h1>NAVIAR</h1>
      <p className="sub">Clarity in complex systems.</p>
      <div className="stack">
        {user ? (
          <Link className="btn" href="/dashboard">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link className="btn" href="/login">
              Sign in
            </Link>
            <Link className="btn ghost" href="/signup">
              Create account
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
