// src/lib/firestore/votingForm.service.ts

import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db, tryAnonymousSignIn } from "@/lib/firebase"

export const saveVotingForm = async (data: any) => {
  const doSave = async () => {
    const docRef = await addDoc(collection(db, "votingForms"), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  try {
    return await doSave()
  } catch (err: any) {
    const message = err?.message ?? String(err)

    // Check for Firestore permission errors
    if (/permission/i.test(message) || /missing.*permissions/i.test(message) || /permission-denied/i.test(message)) {
      // Try anonymous sign-in if enabled and retry once
      const signedIn = await tryAnonymousSignIn()
      if (signedIn) {
        try {
          return await doSave()
        } catch (err2: any) {
          throw new Error(`Failed to save voting form after anonymous sign-in: ${err2?.message ?? String(err2)}`)
        }
      }

      throw new Error(
        `Failed to save voting form: Missing or insufficient permissions. To fix: enable writes for this collection in Firestore rules or enable Authentication (Anonymous) in your Firebase project and set NEXT_PUBLIC_ENABLE_ANON_AUTH=true in your .env.local.`
      )
    }

    throw new Error(`Failed to save voting form: ${message}`)
  }
} 
