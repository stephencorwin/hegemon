import styled from 'styled-components';

export const Container = styled.aside`
  display: flex;
  align-items: center;
  font-size: ${({theme}) => theme.fontSizes.md};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: ${({theme}) => theme.spacings.sm};
  gap: ${({theme}) => theme.spacings.xs};
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 28px;
  height: 28px;
  font-size: ${({theme}) => theme.fontSizes.sm};
  background: ${({theme}) => theme.gradients.sphere(theme.colors.grayDark)};

  &,
  &::after {
    border-radius: 100%;
  }

  &.selected {
    background: ${({theme}) => theme.gradients.sphere(theme.colors.white)};
  }

  span {
    font-size: ${({theme}) => theme.fontSizes.xs};
    align-self: flex-end;
  }
`;
