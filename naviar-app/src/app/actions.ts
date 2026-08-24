"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Returns an error string, or redirects on success. */
export async function login(_prev: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) return "Email and password are required.";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Supabase returns the same error for a wrong password and an unknown
  // address. Keep it that way: distinguishing them lets anyone test whether
  // an address has an account here.
  if (error) return "Incorrect email or password.";

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signup(_prev: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!email || !password) return "Email and password are required.";
  if (password.length < 8) return "Password must be at least 8 characters.";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl()}/auth/confirm`,
    },
  });

  if (error) return error.message;

  redirect("/login?checkEmail=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordReset(
  _prev: string | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return "Email is required.";

  const supabase = await createClient();
  // Reuse the confirm route: it verifies the token server-side, then forwards.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/confirm?next=/update-password`,
  });

  // Always redirect to the same place whether or not the address exists.
  // Reporting "no such account" here would turn this form into a way to test
  // which addresses are registered.
  redirect("/login?checkEmail=reset");
}

export async function updatePassword(
  _prev: string | null,
  formData: FormData,
) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password !== confirm) return "Passwords do not match.";

  const supabase = await createClient();

  // updateUser acts on the session established by the recovery link. If that
  // session is missing or expired, Supabase rejects the call rather than
  // silently changing nothing.
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return error.message;

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
