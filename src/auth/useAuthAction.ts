import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useUser } from "../components/User/useUser";
import { auth } from "../firebase";
import { logoutAction, useAuthDispatch } from "./authContext";

export const useAuthAction = () => {
  const dispatch = useAuthDispatch();
  const { getConnectedUser } = useUser();

  const logInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      getConnectedUser();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth).then(() => {
      dispatch(logoutAction());
      window.location.reload();
    });
  };

  return {
    logInWithEmailAndPassword,
    logout
  }
}
