import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, useId } from "react";

interface FieldProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

export function Input({
  label,
  error,
  icon,
  hint,
  required,
  className = "",
  id,
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {icon && <span className="text-gold-400">{icon}</span>}
          {label}
          {required && <span className="text-gold-400">*</span>}
        </label>
      )}
      <input id={inputId} required={required} className={`field ${error ? "!border-danger" : ""} ${className}`} {...rest} />
      {hint && !error && <p className="mt-1 text-xs text-ink-200">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  required,
  className = "",
  id,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-gold-400">*</span>}
        </label>
      )}
      <textarea id={inputId} required={required} rows={3} className={`field resize-y ${className}`} {...rest} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
