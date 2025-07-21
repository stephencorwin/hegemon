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
  nickname?: string;
}

export function ProfileTile({
  id,
  apiKey,
  isPaper,
  nickname,
}: IProfileTileProps) {
  const {snapshot} = useHegemon();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await snapshot.login(id, apiKey, isPaper);
    navigate('/');
  };

  return (
    <Wrapper>
      <IdWrapper>{nickname ? nickname : id}</IdWrapper>
      <ButtonsWrapper>
        <div>
          <Button disabled>Set Default </Button>
          <Button
            onClick={() => snapshot.registerProfile(apiKey, isPaper, true)}
          >
            Reset
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
