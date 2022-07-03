import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInWithEmailAndPassword } from '../../auth/authActions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('/protected');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) return null;

  return (
    <form
      className='login__container'
      onSubmit={() => logInWithEmailAndPassword(email, password)}>
      <input
        type='text'
        className='login__textBox'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='E-mail Address'
      />
      <input
        type='password'
        className='login__textBox'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      <button className='login__btn' type='submit'>
        Login
      </button>
    </form>
  );
};
