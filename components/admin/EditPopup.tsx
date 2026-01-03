"use client"

import { useState, useEffect } from "react"

type Props = {
  open: boolean
  onClose: () => void
  initialData?: {
    col1?: string
    col2?: string
    col3?: string
  }
  onSave?: (data: { col1: string; col2: string; col3: string }) => void
}

export default function EditPopup({
  open,
  onClose,
  initialData,
  onSave,
}: Props) {
  const [col1, setCol1] = useState("")
  const [col2, setCol2] = useState("")
  const [col3, setCol3] = useState("")

  useEffect(() => {
    if (open) {
      setCol1(initialData?.col1 ?? "")
      setCol2(initialData?.col2 ?? "")
      setCol3(initialData?.col3 ?? "")
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ col1, col2, col3 })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="mb-4 text-lg font-bold">Edit Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Column 1</label>
              <input
                value={col1}
                onChange={(e) => setCol1(e.target.value)}
                className="rounded border px-3 py-2"
                placeholder="Enter value for column 1"
              />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Column 2</label>
              <input
                value={col2}
                onChange={(e) => setCol2(e.target.value)}
                className="rounded border px-3 py-2"
                placeholder="Enter value for column 2"
              />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Column 3</label>
              <input
                value={col3}
                onChange={(e) => setCol3(e.target.value)}
                className="rounded border px-3 py-2"
                placeholder="Enter value for column 3"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
