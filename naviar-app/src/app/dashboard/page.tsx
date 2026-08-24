import { redirect } from "next/navigation";
import { signOut } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The middleware already redirects unauthenticated requests. This second
  // check is deliberate: middleware is a routing convenience, not the security
  // boundary. Every page that reads user data verifies the user itself.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="shell wide">
      <h1>Dashboard</h1>
      <p className="sub">Signed in as {user.email}</p>

      <div className="card">
        <dl>
          <dt>Name</dt>
          <dd>{profile?.full_name ?? "—"}</dd>
          <dt>Email</dt>
          <dd>{profile?.email ?? user.email}</dd>
          <dt>Member since</dt>
          <dd>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "—"}
          </dd>
        </dl>
      </div>

      <form action={signOut} className="alt">
        <button className="btn ghost" type="submit">
          Sign out
        </button>
      </form>
    </main>
  );
}
