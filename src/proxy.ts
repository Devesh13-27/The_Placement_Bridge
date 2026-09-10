/**
 * proxy.ts — thin re-export used by middleware.ts to keep the root
 * middleware file lean. Delegates session refresh logic to the Supabase
 * middleware helper so auth tokens are kept alive on every request.
 */
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
