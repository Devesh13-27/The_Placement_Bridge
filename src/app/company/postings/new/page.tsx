"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPosting } from "@/app/company/actions";

export default function NewPostingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createPosting(new FormData(e.currentTarget));
      router.push("/company/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-xl font-semibold text-slate-900">New hiring posting</h1>
      <p className="mt-1 text-sm text-slate-500">
        This will be visible to T&amp;P officers at every college on the platform.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-5 sm:p-6">
        <Field label="Role title" name="roleTitle" required />
        <Field
          label="Target branches / fields (comma-separated)"
          name="branches"
          placeholder="CSE, ECE, Mechanical"
          required
        />
        <Field label="Number of openings" name="numOpenings" type="number" min={1} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Target start date" name="targetStart" type="date" required />
          <Field label="Target end date" name="targetEnd" type="date" required />
        </div>
        <label className="block text-sm">
          <span className="field-label">Description (optional)</span>
          <textarea name="description" rows={4} className="input-field" />
        </label>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Posting…" : "Publish posting"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        placeholder={placeholder}
        className="input-field"
      />
    </label>
  );
}
