"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVerifiedRole } from "@/lib/guards";
import type { PostingStatus } from "@/lib/types";

export async function createPosting(formData: FormData) {
  const profile = await requireVerifiedRole("hr");
  const supabase = await createClient();

  const branches = (formData.get("branches") as string)
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  const { error } = await supabase.from("postings").insert({
    company_id: profile.company_id,
    created_by: profile.id,
    role_title: formData.get("roleTitle") as string,
    branches,
    num_openings: Number(formData.get("numOpenings")),
    target_start: formData.get("targetStart") as string,
    target_end: formData.get("targetEnd") as string,
    description: (formData.get("description") as string) || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/company/dashboard");
}

export async function updatePostingStatus(postingId: string, status: PostingStatus) {
  await requireVerifiedRole("hr");
  const supabase = await createClient();

  const { error } = await supabase
    .from("postings")
    .update({ status })
    .eq("id", postingId);

  if (error) throw new Error(error.message);

  revalidatePath(`/company/postings/${postingId}`);
  revalidatePath("/company/dashboard");
}

export async function sendMessageAsHr(
  postingId: string,
  companyId: string,
  collegeId: string,
  body: string,
) {
  const profile = await requireVerifiedRole("hr");
  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert({
    posting_id: postingId,
    college_id: collegeId,
    company_id: companyId,
    sender_id: profile.id,
    sender_role: "hr",
    body,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/company/postings/${postingId}`);
}

export async function proposeCamp(
  postingId: string,
  companyId: string,
  collegeId: string,
  type: "camp" | "visit",
  scheduledDate: string,
) {
  const profile = await requireVerifiedRole("hr");
  const supabase = await createClient();

  // One active (proposed/confirmed) camp or visit per posting+college at a
  // time — re-proposing updates that existing row (e.g. to change the date)
  // instead of creating a duplicate.
  const { data: existing } = await supabase
    .from("camps_visits")
    .select("id")
    .eq("posting_id", postingId)
    .eq("college_id", collegeId)
    .in("status", ["proposed", "confirmed"])
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("camps_visits")
        .update({ type, scheduled_date: scheduledDate, status: "proposed" })
        .eq("id", existing.id)
    : await supabase.from("camps_visits").insert({
        posting_id: postingId,
        company_id: companyId,
        college_id: collegeId,
        type,
        scheduled_date: scheduledDate,
        created_by: profile.id,
      });

  if (error) throw new Error(error.message);

  await supabase.from("postings").update({ status: "camp_scheduled" }).eq("id", postingId);

  revalidatePath(`/company/postings/${postingId}`);
}
