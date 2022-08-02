import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAction } from '../../auth/useAuthAction';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import styled from '@emotion/styled';
import { ButtonPill } from '../commons/ButtonPill';
import { useToggle } from '../../hooks/useToggle';
import { theme } from '../../style/theme';
import AppLogo from '../../assets/images/golf-field.png';
import { Flexbox } from '../commons';

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  padding-top: 100px;
  background-color: ${theme.colors.backgroundPage};
  position: relative;
`;

const Form = styled.form`
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  background-color: rgba(255, 255, 255, 0.7);
  width: 90vw;
  z-index: 1;
`;

const ShowPassword = styled.span`
  position: absolute;
  top: 24px;
  right: 17px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(4px);
`;

const Title = styled.h1`
  text-transform: uppercase;
  text-align: center;
`;

const Input = styled.input`
  padding: 15px;
  padding-right: 20px;
  font-size: 17px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  margin: 10px;
  width: calc(100% - 20px);
`;

const InputWrapper = styled.div`
  position: relative;
`;

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const { open, onOpen, onClose } = useToggle();
  const { logInWithEmailAndPassword } = useAuthAction();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate('/protected');
    }
  }, [user, loading]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logInWithEmailAndPassword(email, password);
  };

  if (loading) return null;

  return (
    <Root>
      <Background
        style={{
          backgroundImage: `url('${AppLogo}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
        }}
      />
      <Form onSubmit={handleLogin}>
        <Flexbox flexDirection="column">
          <Flexbox flexDirection="column" alignItems="center">
            <span>Bienvenu à</span>
            <Title>Golf training</Title>
          </Flexbox>
          <InputWrapper>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type={open ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <ShowPassword onClick={() => (open ? onClose() : onOpen())}>
              {open ? 'masquer' : 'afficher'}
            </ShowPassword>
          </InputWrapper>
        </Flexbox>
        <Flexbox flexDirection="column" alignItems="center">
          <ButtonPill type="submit">{`S'identifier`}</ButtonPill>
          <span
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              width: '100px',
              height: '2px',
              borderRadius: '10rem',
              backgroundColor: '#000',
            }}
          />
          <p>Nouveau? Vous souhaitez tester golf training?</p>
          <span>Demander un accès</span>
        </Flexbox>
      </Form>
    </Root>
  );
};
