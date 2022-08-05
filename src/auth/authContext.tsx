import { createContext, useContext, useReducer } from 'react';
import { UserType } from '../components/types';

enum ENUM_AUTH_ACTION_TYPE {
  SIGN_IN = 'SIGN_IN',
  LOGOUT = 'LOGOUT',
}

export const signInAction: (user: UserType) => {
  type: ENUM_AUTH_ACTION_TYPE.SIGN_IN;
  user: UserType;
} = (user: UserType) => ({
  type: ENUM_AUTH_ACTION_TYPE.SIGN_IN,
  user,
});

export const logoutAction: () => {
  type: ENUM_AUTH_ACTION_TYPE.LOGOUT;
} = () => ({
  type: ENUM_AUTH_ACTION_TYPE.LOGOUT,
});

type Action =
  | { type: ENUM_AUTH_ACTION_TYPE.SIGN_IN; user: UserType }
  | { type: ENUM_AUTH_ACTION_TYPE.LOGOUT };

type Dispatch = (action: Action) => void;
type State = { fullUser: UserType | null };
type AuthProviderProps = { children: React.ReactNode };

const AuthContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case ENUM_AUTH_ACTION_TYPE.SIGN_IN: {
      const { user } = action;
      return { ...state, fullUser: user };
    }
    case ENUM_AUTH_ACTION_TYPE.LOGOUT: {
      return { ...state, fullUser: null };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, { fullUser: null });
  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFullUserAuth must be used within a AuthProvider');
  }
  return context;
}

function useAuthDispatch() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFullUserAuth must be used within a AuthProvider');
  }
  return context.dispatch;
}

function useUserContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFullUserAuth must be used within a AuthProvider');
  }
  return context.state.fullUser;
}

export { AuthProvider, useAuthContext, useAuthDispatch, useUserContext };
