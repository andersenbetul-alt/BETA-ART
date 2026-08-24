import { redirect } from "next/navigation";
import { updatePassword } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reached through a recovery link, which establishes a session first. The
  // middleware already guards this path; this check is the actual boundary.
  if (!user) redirect("/login?error=link_invalid");

  return (
    <main className="shell">
      <h1>Set a new password</h1>
      <p className="sub">{user.email}</p>

      <AuthForm action={updatePassword} mode="update-password" />
    </main>
  );
}
