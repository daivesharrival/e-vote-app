"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"

import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import FileUpload from "@/components/ui/FileUpload"

import { votingSchema, VotingFormType } from "@/types/form"
import { uploadImage } from "@/lib/upload"
import { saveVotingForm } from "@/lib/firestore/votingForm.service"

export default function Home() {
  const [candidatePhoto, setCandidatePhoto] = useState<File | null>(null)
  const [symbolPhoto, setSymbolPhoto] = useState<File | null>(null)
  const [candidatePreview, setCandidatePreview] = useState<string | null>(null)
  const [symbolPreview, setSymbolPreview] = useState<string | null>(null)
  const [candidateProgress, setCandidateProgress] = useState<number>(0)
  const [symbolProgress, setSymbolProgress] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VotingFormType>({
    resolver: zodResolver(votingSchema) as Resolver<VotingFormType>,
  })

  // Revoke object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (candidatePreview) URL.revokeObjectURL(candidatePreview)
      if (symbolPreview) URL.revokeObjectURL(symbolPreview)
    }
  }, [candidatePreview, symbolPreview])

  const onSubmit = async (data: VotingFormType) => {
    setIsSubmitting(true)
    try {
      // Ensure candidateNumber is a number (zod preprocess also handles this)
      const payload = {
        ...data,
        candidateNumber: Number((data as any).candidateNumber),
      }

      const candidateUpload = candidatePhoto
        ? await uploadImage(candidatePhoto, "candidate", (p) => setCandidateProgress(p))
        : null

      if (candidateUpload) console.log("Candidate uploaded:", candidateUpload)

      const symbolUpload = symbolPhoto
        ? await uploadImage(symbolPhoto, "symbol", (p) => setSymbolProgress(p))
        : null

      if (symbolUpload) console.log("Symbol uploaded:", symbolUpload)

      const docId = await saveVotingForm({
        ...payload,
        candidatePhotoUrl: candidateUpload?.url ?? "",
        candidatePhotoPath: candidateUpload?.path ?? "",
        candidatePhotoName: candidateUpload?.name ?? "",
        symbolPhotoUrl: symbolUpload?.url ?? "",
        symbolPhotoPath: symbolUpload?.path ?? "",
        symbolPhotoName: symbolUpload?.name ?? "",
      })

      console.log("Voting form saved, id:", docId)
      alert(`मतदान सूचना तयार झाली (id: ${docId})`)

      // Reset local state
      reset()
      setCandidatePhoto(null)
      setSymbolPhoto(null)
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to upload or save voting form:", err)

      const message = err?.message ?? "अपलोड किंवा जतन करण्यात त्रुटी — कृपया पुन्हा प्रयत्न करा."

      if (/upload preset not found/i.test(String(message)) || /cloudinary.*preset/i.test(String(message))) {
        alert(
          "Cloudinary configuration error: upload preset not found. Create an unsigned upload preset in Cloudinary or set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET correctly in .env.local. See https://cloudinary.com/documentation/upload_images#unsigned_uploads"
        )
      } else if (/permission/i.test(String(message)) || /permission-denied/i.test(String(message)) || /insufficient permissions/i.test(String(message))) {
        alert(
          "Permission error: Unable to save the voting form. To fix, either update Firestore rules to allow writes to 'votingForms' (for testing) or enable Anonymous Authentication in Firebase and set NEXT_PUBLIC_ENABLE_ANON_AUTH=true in .env.local."
        )
      } else if (/configuration-not-found/i.test(String(message))) {
        alert(
          "Authentication configuration missing for this Firebase project. Enable Authentication in the Firebase Console to sign in anonymously, or set NEXT_PUBLIC_ENABLE_ANON_AUTH=false in .env.local to skip anonymous sign-in attempts."
        )
      } else {
        alert(message)
      }
    } finally {
      setIsSubmitting(false)
      setCandidateProgress(0)
      setSymbolProgress(0)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl rounded-xl bg-white p-6 shadow"
      >
        <h1 className="mb-2 text-center text-xl font-bold">
          मतदान सूचना तयार करा
        </h1>
        <p className="mb-8 text-center text-gray-500">
          मतदान सूचना तयार करण्यासाठी उमेदवाराची माहिती भरा
        </p>

        {/* ✅ 2 COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* उमेदवार नाव */}
          <Input
            label="उमेदवाराचे नाव (इंग्रजी)"
            required
            placeholder="e.g., Aniket Tanaji Bisure"
            {...register("candidateNameEn")}
            error={errors.candidateNameEn}
          />

          <Input
            label="उमेदवाराचे नाव (मराठी)"
            required
            placeholder="e.g., अनिकेत तनाजी बिसुरे"
            {...register("candidateNameMr")}
            error={errors.candidateNameMr}
          />

          {/* पक्ष */}
          <Input
            label="पक्षाचे नाव (इंग्रजी)"
            required
            placeholder="e.g., BJP"
            {...register("partyNameEn")}
            error={errors.partyNameEn}
          />

          <Input
            label="पक्षाचे नाव (मराठी)"
            required
            placeholder="e.g., भाजप"
            {...register("partyNameMr")}
            error={errors.partyNameMr}
          />

          {/* चिन्ह */}
          <Input
            label="चिन्हाचे नाव (इंग्रजी)"
            required
            placeholder="e.g., Kamal"
            {...register("symbolNameEn")}
            error={errors.symbolNameEn}
          />

          <Input
            label="चिन्हाचे नाव (मराठी)"
            required
            placeholder="e.g., कमळ"
            {...register("symbolNameMr")}
            error={errors.symbolNameMr}
          />

          {/* निवडणूक */}
          <Select
            label="निवडणूक प्रकार"
            options={[
              "Gram Panchayat",
              "Municipal Corporation",
              "Zilla Parishad",
              "Assembly",
            ]}
            {...register("electionType")}
            error={errors.electionType}
          />

          <Input
            label="उमेदवार कोणत्या निवडणुकीसाठी उभा आहे ते भरा"
            required
            placeholder="e.g., सातारा महानगरपालिका सार्वत्रिक निवडणूक २०२५"
            {...register("electionName")}
            error={errors.electionName}
          />

          {/* फोटो */}
          <div>
            <FileUpload
              label="उमेदवाराचा फोटो"
              required
              onFileSelect={(file) => {
                setCandidatePhoto(file)
                setCandidatePreview(file ? URL.createObjectURL(file) : null)
              }}
              selectedFile={candidatePhoto}
            />
            {candidatePreview && (
              <img src={candidatePreview} alt="candidate preview" className="mt-2 h-24 w-24 object-cover rounded" />
            )}
            {candidateProgress > 0 && (
              <p className="text-sm text-gray-500 mt-1">Uploading: {candidateProgress}%</p>
            )}
          </div>

          <div>
            <FileUpload
              label="मतदान चिन्हाचा फोटो"
              required
              onFileSelect={(file) => {
                setSymbolPhoto(file)
                setSymbolPreview(file ? URL.createObjectURL(file) : null)
              }}
              selectedFile={symbolPhoto}
            />
            {symbolPreview && (
              <img src={symbolPreview} alt="symbol preview" className="mt-2 h-24 w-24 object-cover rounded" />
            )}
            {symbolProgress > 0 && (
              <p className="text-sm text-gray-500 mt-1">Uploading: {symbolProgress}%</p>
            )}
          </div>

          {/* तारीख व वेळ */}
          <Input
            type="date"
            label="मतदान तारीख"
            required
            {...register("votingDate")}
            error={errors.votingDate}
          />

          <Input
            type="time"
            label="मतदान सुरू होण्याची वेळ"
            required
            {...register("startTime")}
            error={errors.startTime}
          />

          <Input
            type="time"
            label="मतदान संपण्याची वेळ"
            required
            {...register("endTime")}
            error={errors.endTime}
          />

          <Input
            type="number"
            inputMode="numeric"
            min={1}
            label="उमेदवार अनुक्रमांक (अ. क्र.)"
            required
            placeholder="1"
            {...register("candidateNumber", { valueAsNumber: true })}
            error={errors.candidateNumber}
          />


        </div>

        {/* Submit */}
        <div className="mt-8">
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "मतदान सूचना तयार करा"}
          </Button>
        </div>
      </form>
    </main>
  )
}
