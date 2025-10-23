// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8E9BpGcCvlM7nDlwIpUAka2XY8tHqpd4",
  authDomain: "solates.firebaseapp.com",
  projectId: "solates",
  storageBucket: "solates.firebasestorage.app",
  messagingSenderId: "1013713107813",
  appId: "1:1013713107813:web:ff82f0d20d5ef762b13f8c",
  measurementId: "G-8CB8BRV814"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ✅ Login con redirect (mejor para Vercel)
export async function loginWithGoogle() {
  await signInWithRedirect(auth, provider);
}

// ✅ Recuperar usuario después del redirect
export async function getUserAfterRedirect() {
  const result = await getRedirectResult(auth);
  return result ? result.user : null;
}

// ✅ Logout
export async function logout() {
  await signOut(auth);
}
