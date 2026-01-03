import { getVotingForms } from "@/lib/firestore/votingForm.query"
import CandidateTable from "@/components/vote/CandidateTable"

export default async function VotePage() {
  const candidates = await getVotingForms()

  return (
    <main className="flex min-h-screen justify-center bg-slate-100 p-6">
      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-md border-2 border-black">
        {/* Header */}
        <h1 className="text-center text-2xl font-bold">
          डमी मतदान पत्र
        </h1>

        <p className="text-center text-base text-gray-700 mt-1">
          श्रीगोंदा नगरपरिषद सार्वत्रिक निवडणूक 2025
        </p>

        <p className="mt-4 text-base text-center font-medium">
          योग्य उमेदवारास मतदान करा
        </p>

        {/* Candidate Table */}
        <CandidateTable candidates={candidates} />
      </div>
    </main>
  )
}
