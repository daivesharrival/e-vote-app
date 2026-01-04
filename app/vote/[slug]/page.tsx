import { getVotingForms } from "@/lib/firestore/votingForm.query"
import Image from "next/image"
import Link from "next/link"

type Props = {
  params: {
    slug: string
  }
}

function slugify(s?: string) {
  if (!s) return ""
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0000-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default async function Page({ params }: Props) {
  const all = await getVotingForms()
  const candidate = all.find((c) => slugify(c.candidateNameEn || c.candidateNameMr) === params.slug)

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-md border-2 border-black">
        {!candidate ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Candidate not found</h2>
            <p className="mt-2 text-sm text-gray-600">No candidate matches <code className="bg-gray-100 px-2 py-1 rounded">{params.slug}</code></p>
            <div className="mt-4">
              <Link href="/vote" className="inline-block text-sm text-blue-600 underline">Back to ballot</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="w-28 h-28 rounded-full overflow-hidden border">
                <Image src={candidate.candidatePhotoUrl} alt={candidate.candidateNameEn} width={112} height={112} className="object-cover" />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{candidate.candidateNameEn}</h1>
                <p className="text-sm text-gray-600">{candidate.candidateNameMr}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                    <span className="text-xs text-gray-500">Number</span>
                    <span className="font-medium">{candidate.candidateNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded overflow-hidden border">
                      <Image src={candidate.symbolPhotoUrl} alt="symbol" width={48} height={48} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="bg-[#f7fffa] border border-green-100 rounded-lg p-4 text-center">
                <h3 className="text-sm font-semibold text-green-700">This is the candidate shown for <span className="font-medium">{params.slug}</span></h3>
                <p className="text-xs text-gray-600 mt-1">You can render this inside a card, a "vallet" box, or pass this single-candidate array to tables or other components.</p>
              </div>
            </div>

            <div className="mt-4 w-full flex justify-between">
              <Link href="/vote" className="inline-block text-sm text-gray-700 underline">Back to ballot</Link>
              <a href={`https://wa.me/919876543210`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] text-white px-4 py-2 rounded-md shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.373 0 .039 5.345.04 12c0 2.11.55 4.17 1.6 5.98L0 24l6.35-1.67A11.94 11.94 0 0012 24c6.627 0 11.96-5.345 11.96-12 0-1.86-.42-3.64-1.44-5.14z" fill="#25D366"/>
                  <path d="M17.2 14.47c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18 0-.34-.04-.48-.05-.14-.62-1.5-.85-2.06-.22-.54-.44-.46-.62-.46-.16 0-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.26-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.94 3 4.7 4.2 3.26 1.46 3.26.97 3.85.91.06-.01 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.16-.52-.3z" fill="#fff"/>
                </svg>
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
