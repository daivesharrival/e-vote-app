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
    <div className={`relative w-[200px] rounded-sm bg-white p-2 shadow-sm ring-1 ring-black/5 ${className} z-30`}>
      {/* Close (inline-only) */}
      {inline && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-1 px-2 py-2">
        <h2 className="text-sm font-semibold text-center text-gray-800 truncate">
          {candidateNameMr}
        </h2>

        {/* Candidate photo - small square to match EVM display */}
        <div className="mt-1 flex items-center justify-center">
          <div className="w-[64px] h-[64px] rounded-sm bg-white border overflow-hidden flex items-center justify-center">
            <Image
              src={candidatePhotoUrl}
              alt={candidateNameMr}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        </div>

        {/* Symbol in a rounded square */}
        <div className="mt-2 w-[48px] h-[48px] rounded-sm bg-white border flex items-center justify-center">
          <Image
            src={symbolPhotoUrl}
            alt="symbol"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )

  if (inline) return card

  // Full-screen EVM overlay with the white display box positioned using percentages
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-[320px] sm:w-[420px] md:w-[520px] lg:w-[640px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EVM base image */}
        <Image src="/evm.png" alt="EVM machine" width={640} height={700} className="block w-full h-auto" />

        {/* White display box positioned by percentages inside the EVM screen area */}
        <div
          className="absolute"
          style={{ top: "19%", left: "50%", width: "42%", transform: "translateX(-50%)" }}
        >
          <div className="bg-white rounded-md p-3 shadow-md ring-1 ring-black/10 w-full overflow-hidden">
            <h2 className="text-base font-semibold text-center text-gray-800">
              {candidateNameMr}
            </h2>

            <div className="mt-3 flex items-center justify-center">
              <div className="w-[72px] h-[72px] rounded-md bg-white shadow-sm border overflow-hidden flex items-center justify-center">
                <Image
                  src={candidatePhotoUrl}
                  alt={candidateNameMr}
                  width={72}
                  height={72}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="w-[56px] h-[56px] rounded-md bg-white border flex items-center justify-center shadow-sm">
                <Image
                  src={symbolPhotoUrl}
                  alt="symbol"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                onClick={onClose}
                className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white"
              >
                ठीक आहे
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
