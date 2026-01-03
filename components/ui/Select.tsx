// src/components/ui/Select.tsx
import { FieldError } from "react-hook-form"

type Props = {
  label: string
  error?: FieldError
  options: string[]
} & React.SelectHTMLAttributes<HTMLSelectElement>

export default function Select({ label, error, options, ...props }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        {...props}
        className={`w-full rounded-md border px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">-- Select --</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}
