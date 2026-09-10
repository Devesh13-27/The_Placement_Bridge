"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signup } from "./actions";
import FullLogo from "@/components/FullLogo";
import AuthBackdrop from "@/components/AuthBackdrop";
import BlurText from "@/components/reactbits/BlurText";
import StarBorder from "@/components/reactbits/StarBorder";
import FormField from "@/components/FormField";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"hr" | "tp">("tp");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signup(formData);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Account created — please log in.");
      router.push("/login");
      return;
    }

    router.push("/pending");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
      <AuthBackdrop />
      <FullLogo className="mb-2" />

      <div className="card w-full max-w-md p-6 sm:p-8">
        <BlurText
          text="Create your account"
          className="text-xl font-semibold text-slate-900"
          animateBy="words"
          delay={80}
        />
        <p className="mt-1 text-sm text-slate-500">
          Invite-only portal for verified company HR and college T&amp;P teams.
        </p>

        <div
          role="group"
          aria-label="Account type"
          className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1"
        >
          <button
            type="button"
            aria-pressed={role === "tp"}
            onClick={() => setRole("tp")}
            className={`rounded-md py-2 text-sm font-semibold transition-all ${
              role === "tp"
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            T&amp;P Officer
          </button>
          <button
            type="button"
            aria-pressed={role === "hr"}
            onClick={() => setRole("hr")}
            className={`rounded-md py-2 text-sm font-semibold transition-all ${
              role === "hr"
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Company HR
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="hidden" name="role" value={role} />

          <FormField label="Full name" name="fullName" required />
          <FormField
            label={role === "hr" ? "Official company email" : "Official college email"}
            name="email"
            type="email"
            required
          />
          <FormField label="Password" name="password" type="password" required minLength={8} />
          <FormField
            label={role === "hr" ? "Company name" : "College name"}
            name="orgName"
            required
          />
          {role === "tp" && <FormField label="City" name="orgCity" />}

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
            {loading ? "Creating account…" : "Create account"}
          </StarBorder>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Log in
        </a>
      </p>
    </div>
  );
}


