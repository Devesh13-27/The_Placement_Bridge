import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  helperText?: string;
  error?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  helperText,
  error,
  id,
  required,
  ...rest
}: FormFieldProps) {
  const inputId = id ?? name;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="block">
      <label htmlFor={inputId} className="field-label">
        {label}
        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-red-500"
          >
            *
          </span>
        )}
        {required && (
          <span className="sr-only"> (required)</span>
        )}
      </label>

      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy}
        className={`input-field ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : ""
        }`}
        {...rest}
      />

      {helperText && !error && (
        <p id={helperId} className="field-help">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="field-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}