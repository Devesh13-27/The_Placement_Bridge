"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

type ActionResult = { success: true } | { success: false; error: string };

async function assertAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized.");
  }
}

export async function decideProfile(
  profileId: string,
  orgTable: "companies" | "colleges",
  orgId: string,
  decision: "verified" | "rejected",
): Promise<ActionResult> {
  await assertAdmin();
  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ verification_status: decision })
    .eq("id", profileId);

  if (profileError) return { success: false, error: profileError.message };

  if (decision === "verified") {
    const { error: orgError } = await supabase
      .from(orgTable)
      .update({ verification_status: "verified" })
      .eq("id", orgId);

    if (orgError) return { success: false, error: orgError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
