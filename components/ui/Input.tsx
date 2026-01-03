// src/components/ui/Input.tsx
import { FieldError } from "react-hook-form"

type InputProps = {
  label: string
  error?: FieldError
  required?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({
  label,
  error,
  required,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}
