import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function Home() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");

  if (profile.verification_status !== "verified") redirect("/pending");
  if (profile.role === "admin") redirect("/admin");
  if (profile.role === "hr") redirect("/company/dashboard");
  redirect("/college/dashboard");
}
