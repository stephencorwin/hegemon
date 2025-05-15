import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 225px;
  background-color: ${({theme}) => theme.colors.whiteLight};
  padding: ${({theme}) => theme.spacings.xs};
  box-shadow: ${({theme}) => theme.shadows.raised2};

  text-shadow: none;
  text-transform: uppercase;
  color: ${({theme}) => theme.colors.black};
`;

export const IdWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

export const ButtonsWrapper = styled.div`
  margin-top: ${({theme}) => theme.spacings.xs};

  > div {
    display: flex;
    height: 30px;
    width: 100%;
    gap: ${({theme}) => theme.spacings.xs};
  }
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 30px;
  background-color: ${({theme}) => theme.colors.white};
  color: ${({theme}) => theme.colors.black};
  font-size: ${({theme}) => theme.fontSizes.sm};
  text-shadow: none;

  &:disabled {
    color: rgba(0, 0, 0, 0.5);
  }
`;

export const LoginButton = styled(Button)`
  margin-top: ${({theme}) => theme.spacings.xs};
  width: 100%;
`;
