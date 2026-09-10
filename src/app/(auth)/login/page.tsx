"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FullLogo from "@/components/FullLogo";
import AuthBackdrop from "@/components/AuthBackdrop";
import BlurText from "@/components/reactbits/BlurText";
import StarBorder from "@/components/reactbits/StarBorder";
import FormField from "@/components/FormField";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
      <AuthBackdrop />
      <FullLogo className="mb-2" size="w-56 sm:w-80" />

      <div className="card w-full max-w-md p-6 sm:p-8">
        <BlurText
          text="Log in"
          className="text-xl font-semibold text-slate-900"
          animateBy="letters"
          delay={30}
        />
        <p className="mt-1 text-sm text-slate-500">Welcome back to Placement Bridge.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Password" name="password" type="password" required />

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <StarBorder
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "opacity-70" : ""}`}
          >
            {loading ? "Logging in…" : "Log in"}
          </StarBorder>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
          Sign up
        </a>
      </p>
    </div>
  );
}
