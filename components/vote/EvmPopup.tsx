"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

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

  // Text-to-Speech: play Marathi message once when popup opens
  const hasSpokenRef = useRef(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis

    function cancelSpeech() {
      try {
        synth.cancel()
      } catch (e) {
        // ignore errors
      }
      utteranceRef.current = null
    }

    if (!open) {
      // Reset flag so the text can play the next time popup opens
      hasSpokenRef.current = false
      cancelSpeech()
      return
    }

    if (hasSpokenRef.current) return

    const text = "धन्यवाद तुमचे डेमो मतदान झाले आहे ."

    function selectVoice(): SpeechSynthesisVoice | null {
      const voices = synth.getVoices()
      if (!voices || voices.length === 0) return null
      // Prefer Marathi, then Hindi, then any IN locale, then fallback
      let v = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("mr"))
      if (!v) v = voices.find((v) => v.name && v.name.toLowerCase().includes("marathi"))
      if (!v) v = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("hi"))
      if (!v) v = voices.find((v) => v.lang && v.lang.toLowerCase().includes("in"))
      if (!v) v = voices[0]
      return v || null
    }

    function speakWithVoice(voice: SpeechSynthesisVoice | null) {
      if (!open) return
      const utterance = new SpeechSynthesisUtterance(text)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang || "mr-IN"
      } else {
        utterance.lang = "mr-IN"
      }
      // tuned for a natural Marathi-like speaking rate
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.onend = () => {
        // finished
      }
      utterance.onerror = () => {
        // ignore errors
      }
      utteranceRef.current = utterance
      synth.speak(utterance)
      hasSpokenRef.current = true
    }

    const voice = selectVoice()
    if (voice) {
      speakWithVoice(voice)
      return () => cancelSpeech()
    }

    // If voices not loaded yet, wait for voiceschanged event once
    const onVoicesChanged = () => {
      const v2 = selectVoice()
      speakWithVoice(v2)
      synth.removeEventListener("voiceschanged", onVoicesChanged)
    }
    synth.addEventListener("voiceschanged", onVoicesChanged)

    return () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged)
      cancelSpeech()
    }
  }, [open])

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
