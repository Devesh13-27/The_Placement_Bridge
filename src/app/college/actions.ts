"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVerifiedRole } from "@/lib/guards";

export async function upsertInterest(
  postingId: string,
  interestedCount: number,
  eligibleCount: number,
) {
  const profile = await requireVerifiedRole("tp");
  const supabase = await createClient();

  const { error } = await supabase.from("interest_reports").upsert(
    {
      posting_id: postingId,
      college_id: profile.college_id,
      reported_by: profile.id,
      interested_count: interestedCount,
      eligible_count: eligibleCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "posting_id,college_id" },
  );

  if (error) throw new Error(error.message);

  revalidatePath(`/college/postings/${postingId}`);
  revalidatePath("/college/dashboard");
}

export async function sendMessageAsTp(
  postingId: string,
  companyId: string,
  body: string,
) {
  const profile = await requireVerifiedRole("tp");
  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert({
    posting_id: postingId,
    college_id: profile.college_id,
    company_id: companyId,
    sender_id: profile.id,
    sender_role: "tp",
    body,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/college/postings/${postingId}`);
}

export async function confirmCamp(campId: string) {
  await requireVerifiedRole("tp");
  const supabase = await createClient();

  const { error } = await supabase
    .from("camps_visits")
    .update({ status: "confirmed" })
    .eq("id", campId);

  if (error) throw new Error(error.message);

  revalidatePath("/college/camps");
}
