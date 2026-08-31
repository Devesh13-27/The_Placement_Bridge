"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

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
) {
  await assertAdmin();
  const supabase = await createClient();

  await supabase
    .from("profiles")
    .update({ verification_status: decision })
    .eq("id", profileId);

  if (decision === "verified") {
    await supabase.from(orgTable).update({ verification_status: "verified" }).eq("id", orgId);
  }

  revalidatePath("/admin");
}
