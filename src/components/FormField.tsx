import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  helperText?: string;
};

export default function FormField({
  label,
  name,
  error,
  helperText,
  className = "",
  id,
  ...props
}: FormFieldProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="block text-sm">
      <label htmlFor={inputId} className="field-label">
        {label}
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={inputId}
        name={name}
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`input-field mt-1 ${className}`}
      />

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}