import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireVerifiedRole } from "@/lib/guards";
import Nav from "@/components/Nav";
import EmptyState from "@/components/EmptyState";
import FadeInStagger from "@/components/reactbits/FadeInStagger";
import StatCard from "@/components/StatCard";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/statusStyles";

export default async function CompanyDashboard() {
  const profile = await requireVerifiedRole("hr");
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", profile.company_id)
    .single();

  const { data: postings } = await supabase
    .from("postings")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  const postingIds = (postings ?? []).map((p) => p.id);
  const { data: interests } = postingIds.length
    ? await supabase
        .from("interest_reports")
        .select("posting_id, interested_count")
        .in("posting_id", postingIds)
    : { data: [] as { posting_id: string; interested_count: number }[] };

  const interestByPosting = new Map<string, number>();
  for (const row of interests ?? []) {
    interestByPosting.set(
      row.posting_id,
      (interestByPosting.get(row.posting_id) ?? 0) + row.interested_count,
    );
  }

  const openCount = (postings ?? []).filter((p) => p.status === "open").length;
  const campScheduledCount = (postings ?? []).filter((p) => p.status === "camp_scheduled").length;
  const totalInterested = (interests ?? []).reduce((sum, r) => sum + r.interested_count, 0);

  return (
    <div>
      <Nav
        orgName={company?.name ?? ""}
        links={[{ href: "/company/dashboard", label: "Postings" }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {!!postings?.length && (
          <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard label="Open postings" value={openCount} accent="text-green-600" />
            <StatCard label="Camps scheduled" value={campScheduledCount} accent="text-blue-600" />
            <StatCard label="Total interested" value={totalInterested} />
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Your hiring postings</h1>
          <Link href="/company/postings/new" className="btn-primary sm:self-auto">
            + New posting
          </Link>
        </div>

        {!postings?.length && (
          <EmptyState
            icon="📋"
            title="No postings yet"
            description="Create one to start reaching colleges and see who's interested."
            action={
              <Link href="/company/postings/new" className="btn-primary">
                + New posting
              </Link>
            }
          />
        )}

        <FadeInStagger className="space-y-3">
          {postings?.map((p) => (
            <Link key={p.id} href={`/company/postings/${p.id}`} className="card-interactive block p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{p.role_title}</p>
                  <p className="text-sm text-slate-500">
                    {p.branches.join(", ")} · {p.num_openings} openings ·{" "}
                    {p.target_start} → {p.target_end}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {interestByPosting.get(p.id) ?? 0} interested
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[p.status as keyof typeof STATUS_COLOR]}`}
                  >
                    {STATUS_LABEL[p.status as keyof typeof STATUS_LABEL]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </FadeInStagger>
      </div>
    </div>
  );
}
