"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { emailDomain, FREEMAIL_DOMAINS } from "@/lib/auth";

export interface SignupResult {
  success: boolean;
  error?: string;
}

export async function signup(formData: FormData): Promise<SignupResult> {
  const role = formData.get("role") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const orgName = (formData.get("orgName") as string)?.trim();
  const orgCity = (formData.get("orgCity") as string)?.trim() || null;

  if (!["hr", "tp"].includes(role)) {
    return { success: false, error: "Invalid role." };
  }
  if (!fullName || !email || !password || !orgName) {
    return { success: false, error: "All fields are required." };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const domain = emailDomain(email);
  if (!domain || !domain.includes(".")) {
    return { success: false, error: "Enter a valid email address." };
  }
  const isFreemail = FREEMAIL_DOMAINS.has(domain);

  const admin = createAdminClient();
  const orgTable = role === "hr" ? "companies" : "colleges";

  // Non-freemail domains (e.g. acmecorp.com) match orgs by domain, so every
  // official-email signup from the same org auto-links to it. Freemail
  // domains (gmail.com etc.) can't be used that way — every org would
  // collide on "gmail.com" — so those match by the org name instead.
  // Admin approval is still the real trust gate in both cases.
  const { data: existingOrg } = await (isFreemail
    ? admin.from(orgTable).select("id").ilike("name", orgName)
    : admin.from(orgTable).select("id").eq("domain", domain)
  ).maybeSingle();

  let orgId = existingOrg?.id as string | undefined;

  if (!orgId) {
    const insertPayload: Record<string, unknown> =
      role === "hr"
        ? { name: orgName, domain }
        : { name: orgName, domain, city: orgCity };

    const { data: newOrg, error: orgError } = await admin
      .from(orgTable)
      .insert(insertPayload)
      .select("id")
      .single();

    if (orgError || !newOrg) {
      return { success: false, error: "Could not register organization. Try again." };
    }
    orgId = newOrg.id;
  }

  const { data: newUser, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (userError || !newUser?.user) {
    return {
      success: false,
      error: userError?.message ?? "Could not create account.",
    };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: newUser.user.id,
    full_name: fullName,
    email,
    role,
    company_id: role === "hr" ? orgId : null,
    college_id: role === "tp" ? orgId : null,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(newUser.user.id);
    return { success: false, error: "Could not create profile. Try again." };
  }

  return { success: true };
}
