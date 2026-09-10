"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPosting } from "@/app/company/actions";
import FormField from "@/components/FormField";

interface FieldErrors {
  roleTitle?: string;
  branches?: string;
  numOpenings?: string;
  targetStart?: string;
  targetEnd?: string;
}

export default function NewPostingPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(formData: FormData): FieldErrors {
    const nextErrors: FieldErrors = {};

    const roleTitle = String(formData.get("roleTitle") ?? "").trim();
    const branches = String(formData.get("branches") ?? "").trim();
    const numOpenings = String(formData.get("numOpenings") ?? "").trim();
    const targetStart = String(formData.get("targetStart") ?? "").trim();
    const targetEnd = String(formData.get("targetEnd") ?? "").trim();

    if (!roleTitle) {
      nextErrors.roleTitle = "Role title is required.";
    } else if (roleTitle.length < 2) {
      nextErrors.roleTitle = "Role title must be at least 2 characters.";
    }

    if (!branches) {
      nextErrors.branches = "Enter at least one branch or field.";
    }

    if (!numOpenings) {
      nextErrors.numOpenings = "Number of openings is required.";
    } else {
      const openings = Number(numOpenings);

      if (!Number.isInteger(openings) || openings < 1) {
        nextErrors.numOpenings = "Enter a whole number of at least 1.";
      }
    }

    if (!targetStart) {
      nextErrors.targetStart = "Start date is required.";
    }

    if (!targetEnd) {
      nextErrors.targetEnd = "End date is required.";
    }

    if (targetStart && targetEnd && targetEnd < targetStart) {
      nextErrors.targetEnd = "End date must be on or after the start date.";
    }

    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await createPosting(formData);

      if (!result.success) {
        setFormError(result.error ?? "Something went wrong while publishing.");
        return;
      }

      router.push("/company/dashboard");
      router.refresh();
    } catch {
      setFormError(
        "We couldn't publish the posting right now. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Hiring
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          New hiring posting
        </h1>

        <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
          This will be visible to T&amp;P officers at every college on the
          platform.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="card space-y-5 p-5 sm:p-6"
      >
        <FormField
          label="Role title"
          name="roleTitle"
          placeholder="e.g. Software Engineer"
          autoComplete="off"
          required
          error={errors.roleTitle}
        />

        <FormField
          label="Target branches / fields"
          name="branches"
          placeholder="CSE, ECE, Mechanical"
          helperText="Separate multiple branches with commas."
          required
          error={errors.branches}
        />

        <FormField
          label="Number of openings"
          name="numOpenings"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          placeholder="e.g. 5"
          required
          error={errors.numOpenings}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Target start date"
            name="targetStart"
            type="date"
            required
            error={errors.targetStart}
          />

          <FormField
            label="Target end date"
            name="targetEnd"
            type="date"
            required
            error={errors.targetEnd}
          />
        </div>

        <label className="block text-sm">
          <span className="field-label">
            Description <span className="font-normal text-slate-400">(optional)</span>
          </span>

          <textarea
            name="description"
            rows={5}
            placeholder="Add eligibility details, responsibilities, or anything colleges should know."
            className="input-field min-h-32 resize-y"
          />

          <span className="field-help">
            Keep it concise and include the most important information for T&amp;P
            officers.
          </span>
        </label>

        {formError && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
          >
            {formError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="btn-secondary w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary w-full min-w-36 sm:w-auto"
          >
            {loading ? "Publishing…" : "Publish posting"}
          </button>
        </div>
      </form>
    </div>
  );
}