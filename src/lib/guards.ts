import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import type { Profile, Role } from "@/lib/types";

export async function requireVerifiedRole(role: Role): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.verification_status !== "verified") redirect("/pending");
  if (profile.role !== role) redirect("/");
  return profile;
}
