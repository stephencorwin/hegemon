import React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Wrapper,
  IdWrapper,
  ButtonsWrapper,
  Button,
  LoginButton,
} from './styles';
import {useHegemon} from '../../../hooks';

export interface IProfileTileProps {
  id: string;
  apiKey: string;
  isPaper?: boolean;
}

export function ProfileTile({id, apiKey, isPaper}: IProfileTileProps) {
  const {snapshot} = useHegemon();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await snapshot.login(id, apiKey, isPaper);
    navigate('/');
  };

  return (
    <Wrapper>
      <IdWrapper>{id}</IdWrapper>
      <ButtonsWrapper>
        <div>
          <Button disabled>
            Set Default{' '}
            <span style={{fontSize: 10, marginLeft: 10}}>(SoonTM)</span>
          </Button>
          <Button onClick={() => snapshot.unregisterProfile(id)}>
            Unregister
          </Button>
        </div>
        <LoginButton onClick={handleLogin}>Login</LoginButton>
      </ButtonsWrapper>
    </Wrapper>
  );
}
