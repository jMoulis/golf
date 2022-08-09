import { collection, deleteDoc, doc, Firestore, getFirestore, onSnapshot, query, setDoc, Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "../../../firebase";
import { CourseType } from "../../types";
import { sortHoles } from "./utils";

export const useCourse = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [user] = useAuthState(auth);
  const coursesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const getCourses = useCallback(async () => {

    const coursesQuery = query(
      collection(db.current, 'courses'),
    );
    // const querySnapshot = await getDocs(collection(db, 'courses'));
    coursesUnsubscribe.current = onSnapshot(
      coursesQuery,
      (payload) => {
        const incomingGames = payload.docs.map((doc) => {
          const course = doc.data() as CourseType;
          const holes = sortHoles(course.holes);
          return {
            id: doc.id,
            ...course,
            holes
          };
        });
        setCourses(incomingGames);
      },
      (error) => {
        console.error('Get courses', error.message);
      },
    );
  }, []);

  useEffect(() => {
    if (user) {
      getCourses();
    }
    const unsubscribeCourses = coursesUnsubscribe.current;
    return () => {
      if (unsubscribeCourses) {
        unsubscribeCourses();
      }
    };
  }, [getCourses, user]);

  const handleSubmit = async (course: CourseType) => {
    try {
      const docRef = doc(db.current, 'courses', course.name);
      const mapHoles = course.holes.reduce(
        (acc: Record<string, any>, hole: any) => {
          return {
            ...acc,
            [`hole-${hole.number}`]: {
              ref: `hole-${hole.number}`,
              ...hole,
            },
          };
        },
        {},
      );
      setDoc(docRef, {
        ...course,
        countHoles: course.holes.length,
        holes: mapHoles,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleDelete = (courseRef: string) => {
    deleteDoc(doc(db.current, 'courses', courseRef))
  };

  return {
    courses,
    onSave: handleSubmit,
    onDelete: handleDelete
  }
}