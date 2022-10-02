import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "firebaseConfig/firebase";
import { ClubType } from "components/types";

export const useClubs: () => {
  clubs: ClubType[];
} = () => {
  const [clubs, setClubs] = useState<ClubType[]>([]);
  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "clubs"));
    getDocs(q).then((querySnapshot) => {
      const payload: any[] = [];
      querySnapshot.forEach((doc) => {
        payload.push({ id: doc.id, ...doc.data() })
      });
      setClubs(payload);
    });
  }, []);


  return {
    clubs
  }
}