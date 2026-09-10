import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import type { Profile, Role } from "@/lib/types";

export async function requireVerifiedRole(role: Role | Role[]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.verification_status !== "verified") redirect("/pending");
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(profile.role)) redirect("/");
  return profile;
}
