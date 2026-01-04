import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize auth only on the client (browser) and when an API key is available.
// This prevents server-side builds from failing when NEXT_PUBLIC_* env vars are not set.
export const auth = (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  ? getAuth(app)
  : null

export const db = getFirestore(app)

/**
 * Try to sign in anonymously if NEXT_PUBLIC_ENABLE_ANON_AUTH is set to "true".
 * Returns true if sign-in succeeded or user is already signed-in; false otherwise.
 */
export const tryAnonymousSignIn = async (): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_ENABLE_ANON_AUTH !== "true") return false
  if (!auth) {
    // If auth is not available (server or missing API key), bail silently.
    return false
  }

  try {
    // Import signInAnonymously lazily to keep modules tree-shakable in environments
    const { signInAnonymously } = await import("firebase/auth")
    await signInAnonymously(auth)
    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Anonymous sign-in failed:", err)
    return false
  }
}
