"use client"

import { useRef, useState, useEffect } from "react"

type FileUploadProps = {
  label: string
  required?: boolean
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
}

export default function FileUpload({
  label,
  required,
  onFileSelect,
  selectedFile,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("No file chosen")

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file ? file.name : "No file chosen")
    onFileSelect(file)
  }

  // Reset displayed filename when parent clears selected file
  useEffect(() => {
    setFileName(selectedFile ? selectedFile.name : "No file chosen")
  }, [selectedFile])

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-3 rounded-md border px-3 py-2">
        <button
          type="button"
          onClick={handleClick}
          className="rounded-md bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-200"
        >
          Choose File
        </button>

        <span className="text-sm text-gray-500 truncate">
          {fileName}
        </span>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
