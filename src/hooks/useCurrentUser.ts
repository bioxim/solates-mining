/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const saved = localStorage.getItem("solates_user");
      if (!saved) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(saved);
      const ref = doc(db, "users", parsed.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser({ uid: parsed.uid, ...snap.data() });
      }

      setLoading(false);
    }

    load();
  }, []);

  return { user, loading };
}
