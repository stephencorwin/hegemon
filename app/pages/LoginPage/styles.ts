import styled from 'styled-components';

export const Main = styled.main`
  background-image: url('/assets/login-background_02.jpg');
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormWrapper = styled.div`
  transform: translateY(-50%);
  width: 500px;
  font-size: 28px;

  h1 {
    font-size: 96px;
    margin-bottom: 40px;
    text-align: center;
    text-shadow: ${({theme}) => theme.shadows.text};
  }
`;

export const FormInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${({theme}) => theme.spacings.md};

  > input[type='password'],
  > input[type='text'] {
    background-color: ${({theme}) => theme.colors.whiteLight};
    padding: 0 ${({theme}) => theme.spacings.lg};
    height: 60px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  > input[type='checkbox'] {
    background-color: ${({theme}) => theme.colors.whiteLight};
    appearance: none;
    width: 50px;
    height: 50px;
    box-shadow: ${({theme}) => theme.shadows.raised1};

    &:checked {
      appearance: auto;
    }
  }

  > label {
    margin-left: ${({theme}) => theme.spacings.sm};
    text-shadow: ${({theme}) => theme.shadows.text};
  }

  > button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    padding: 0 ${({theme}) => theme.spacings.lg};
    background-color: ${({theme}) => theme.colors.white};
    color: ${({theme}) => theme.colors.black};
    text-shadow: none;
    font-size: 32px;
  }
`;

export const ProfileTileWrapper = styled.div`
  position: fixed;
  display: flex;
  gap: 50px;
  bottom: 50px;
  left: 50px;
`;
