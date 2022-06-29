import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const logInWithEmailAndPassword = async (email: string, password: string) => {

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};