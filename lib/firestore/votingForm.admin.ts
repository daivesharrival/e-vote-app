import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export type VotingFormRow = {
  id: string
  candidateNameMr: string
  partyNameMr: string
  electionType: string
  candidateNumber: number
}

export const getAllVotingForms = async (): Promise<VotingFormRow[]> => {
  const q = query(
    collection(db, "votingForms"),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((d) => {
    const data = d.data()

    return {
      id: d.id,
      candidateNameMr: data.candidateNameMr,
      partyNameMr: data.partyNameMr,
      electionType: data.electionType,
      candidateNumber: data.candidateNumber,
    }
  })
}

export const deleteVotingForm = async (id: string) => {
  await deleteDoc(doc(db, "votingForms", id))
}
