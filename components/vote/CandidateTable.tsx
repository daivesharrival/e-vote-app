"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import EvmPopup from "./EvmPopup"

type Candidate = {
  id: string
  candidateNameMr: string
  candidatePhotoUrl: string
  symbolPhotoUrl: string
}

export default function CandidateTable({
  candidates,
}: {
  candidates: Candidate[]
}) {
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [blinkingIndex, setBlinkingIndex] = useState<number | null>(null)

  const beepRef = useRef<HTMLAudioElement | null>(null)
  const totalRows = 16

  const handleVoteClick = (c: Candidate, index: number) => {
    // Start blinking LED
    setBlinkingIndex(index)

    // Play beep sound
    beepRef.current?.play()

    // Stop blinking + open popup
    setTimeout(() => {
      setBlinkingIndex(null)
      setSelected(c)
    }, 400)
  }

  return (
    <>
      {/* Beep sound */}
      <audio ref={beepRef} src="/beep.mp3" preload="auto" />

    

      <table className="mt-4 w-full border-2 border-black text-sm">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border-2 border-black w-[50px]">अ.क्र.</th>
            <th className="border-2 border-black">उमेदवाराचे नाव</th>
            <th className="border-2 border-black">चिन्ह</th>
            <th className="border-2 border-black w-[140px]">बटन</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: totalRows }).map((_, index) => {
            const c = candidates[index]
            const isBlinking = blinkingIndex === index

            return (
              <tr key={index} className="h-[110px] text-center">
                {/* Serial */}
                <td className="border-2 border-black">
                  {index + 1}.
                </td>

                {/* Candidate */}
                <td className="border-2 border-black">
                  {c && (
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={c.candidatePhotoUrl}
                        alt={c.candidateNameMr}
                        width={64}
                        height={64}
                        className="rounded-full border"
                      />
                      <span className="font-semibold">
                        {c.candidateNameMr}
                      </span>
                    </div>
                  )}
                </td>

                {/* Symbol */}
                <td className="border-2 border-black">
                  {c && (
                    <Image
                      src={c.symbolPhotoUrl}
                      alt="symbol"
                      width={64}
                      height={64}
                    />
                  )}
                </td>

                {/* Button + LED */}
                <td className="border-2 border-black">
                  {c && (
                    <div className="flex items-center justify-center gap-2">
                      {/* LED */}
                      <span
                        className={`
                          h-3 w-3 rounded-full
                          ${isBlinking ? "bg-green-500 animate-pulse" : "bg-gray-300"}
                        `}
                      />

                      {/* Vote Button */}
                      <button
                        onClick={() => handleVoteClick(c, index)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
                      >
                        बटन दाबा
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Full-screen EVM popup overlay when a candidate is selected */}
      {selected && (
        <EvmPopup
          open
          onClose={() => setSelected(null)}
          candidateNameMr={selected.candidateNameMr}
          candidatePhotoUrl={selected.candidatePhotoUrl}
          symbolPhotoUrl={selected.symbolPhotoUrl}
        />
      )}

    </>
  )
}
