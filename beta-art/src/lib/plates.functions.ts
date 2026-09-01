import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin-only catalogue read. The route guard is UX only — this server-side
 * role check is the security boundary.
 */
export const listAllPlates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error("Role check failed");
    if (!isAdmin) throw new Error("Forbidden: admin role required");

    const { data, error } = await context.supabase
      .from("plates")
      .select(
        "id, slug, title, catalogue, price_minor, currency, verification_status, raw_archived, capture_record_present, price_confirmed, published",
      )
      .order("catalogue", { ascending: true });
    if (error) throw new Error(error.message);
    return { plates: data ?? [] };
  });

/** Returns the caller's roles. Used for the admin UI affordance only. */
export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r) => r.role) };
  });
