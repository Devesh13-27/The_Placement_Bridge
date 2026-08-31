import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "rediffmail.com",
]);

export function emailDomain(email: string) {
  return email.split("@")[1]?.toLowerCase().trim() ?? "";
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}
