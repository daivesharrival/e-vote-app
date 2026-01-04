import { getVotingForms } from "@/lib/firestore/votingForm.query"
import CandidateTable from "@/components/vote/CandidateTable"

export default async function VotePage() {
  const candidates = await getVotingForms()
console.log("Fetched candidates:", candidates)
  return (
    <main className="flex min-h-screen justify-center bg-slate-100 p-6">
      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-md border-2 border-black">
        {/* Header */}
       
       <div className="text-center">
         <h1 className="text-center text-2xl font-bold">
          डमी मतदान पत्र
        </h1>

        <p className="text-center text-base text-gray-700 mt-1">
          कोल्हापूर  नगरपरिषद सार्वत्रिक निवडणूक 2025
        </p>

          <p className="text-center text-base text-gray-700 mt-1">
          डेमो मतदानासाठी "कमळ" निशाणी समोरील निळे बटण दाबावे

          मतदानाच्या दिवशी सुद्धा "कमळ" या चिन्हासमोरील बटन दाबून "दैवेश सूर्यवंशी
          " यांना प्रचंड मतांनी विजयी करा !
        </p>

        <p className="mt-4 text-base text-center font-medium">
          योग्य उमेदवारास मतदान करा
        </p>
       </div>

        {/* Voting schedule (dynamic) */}
        {/* For demo values — replace with API/config */}
        {(() => {
          const scheduleStartISO = new Date("2025-04-10T08:00:00").toISOString()
          const scheduleEndISO = new Date("2025-04-10T17:00:00").toISOString()

          function formatVoteTime(startIso: string, endIso: string) {
            const s = new Date(startIso)
            const e = new Date(endIso)
            const day = s.getDate()
            const month = new Intl.DateTimeFormat("mr-IN", { month: "long" }).format(s)
            const year = s.getFullYear()

            function fmt(d: Date) {
              const hrs = d.getHours()
              const mins = d.getMinutes()
              const h = hrs % 12 === 0 ? 12 : hrs % 12
              const mm = mins.toString().padStart(2, "0")
              const period = hrs < 12 ? "सकाळी" : "संध्याकाळी"
              return `${period} ${h}:${mm}`
            }

            return `मतदान वेळ: ${day} ${month} ${year}, ${fmt(s)} ते ${fmt(e)}`
          }

          const formatted = formatVoteTime(scheduleStartISO, scheduleEndISO)

          return (
            <div className="mt-2 text-center text-sm text-gray-700">{formatted}</div>
          )
        })()}

        <div className="mt-6">
          <a
            href="https://wa.me/919763346969"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition"
          >
            <span className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.373 0 .039 5.345.04 12c0 2.11.55 4.17 1.6 5.98L0 24l6.35-1.67A11.94 11.94 0 0012 24c6.627 0 11.96-5.345 11.96-12 0-1.86-.42-3.64-1.44-5.14z" fill="#25D366"/>
                <path d="M17.2 14.47c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18 0-.34-.04-.48-.05-.14-.62-1.5-.85-2.06-.22-.54-.44-.46-.62-.46-.16 0-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.26-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.94 3 4.7 4.2 3.26 1.46 3.26.97 3.85.91.06-.01 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.16-.52-.3z" fill="#fff"/>
              </svg>
            </span>
            <span className="text-sm font-medium text-center">Inquiry: +91 9763346969</span>
          </a>
        </div>

        {/* Candidate Table */}
        <CandidateTable 
          candidates={candidates}
 
        />
      </div>
    </main>
  )
}
