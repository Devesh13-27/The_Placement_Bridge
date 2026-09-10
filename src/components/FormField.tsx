import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

/**
 * Reusable labelled input field used across auth and posting forms.
 */
export default function FormField({ label, name, type = "text", ...rest }: FormFieldProps) {
  return (
    <label className="block text-sm">
      <span className="field-label">{label}</span>
      <input name={name} type={type} className="input-field" {...rest} />
    </label>
  );
}
