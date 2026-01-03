import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export type VotingFormPlain = {
  id: string
  candidateNameMr: string
  candidatePhotoUrl: string
  symbolPhotoUrl: string
  candidateNumber: number
}

export const getVotingForms = async (): Promise<VotingFormPlain[]> => {
  const q = query(
    collection(db, "votingForms"),
    orderBy("candidateNumber", "asc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      id: doc.id,
      candidateNameMr: data.candidateNameMr,
      candidatePhotoUrl: data.candidatePhotoUrl,
      symbolPhotoUrl: data.symbolPhotoUrl,
      candidateNumber: data.candidateNumber,
      // ❌ DO NOT return createdAt (Timestamp)
    }
  })
}
