"use client"

import Image from "next/image"
import { useEffect } from "react"

type Props = {
  open: boolean
  onClose: () => void
  candidateNameMr: string
  candidatePhotoUrl: string
  symbolPhotoUrl: string
  inline?: boolean
  className?: string
}

export default function EvmPopup({
  open,
  onClose,
  candidateNameMr,
  candidatePhotoUrl,
  symbolPhotoUrl,
  inline = false,
  className = "",
}: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const card = (
    <div className={`relative w-[200px] rounded-lg bg-white p-3 shadow-md ring-1 ring-black/10 ${className} z-30`}>
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      {/* Content */}
      <div className="flex flex-col items-center gap-2 px-3 py-2">
        <h2 className="text-base font-semibold text-center text-gray-800">
          {candidateNameMr}
        </h2>

        {/* Candidate photo - square with rounded corners */}
        <div className="mt-1 flex items-center justify-center">
          <div className="w-[68px] h-[68px] rounded-md bg-white shadow-sm border overflow-hidden flex items-center justify-center">
            <Image
              src={candidatePhotoUrl}
              alt={candidateNameMr}
              width={68}
              height={68}
              className="object-cover"
            />
          </div>
        </div>

        {/* Symbol in a rounded square */}
        <div className="mt-2 w-[56px] h-[56px] rounded-md bg-white border flex items-center justify-center shadow-sm">
          <Image
            src={symbolPhotoUrl}
            alt="symbol"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )

  if (inline) return card

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      {card}
    </div>
  )
}
