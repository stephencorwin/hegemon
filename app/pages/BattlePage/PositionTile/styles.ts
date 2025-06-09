import styled from 'styled-components';

export const Tile = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 250px;
  background-color: ${({theme}) => theme.colors.whiteLight};
  padding: ${({theme}) => theme.spacings.xs};
  box-shadow: ${({theme}) => theme.shadows.raised1};
`;

export const FillValue = styled.div`
  transition: width 1s ease;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  min-width: 0;
  background-color: ${({theme}) => theme.colors.green};
  box-shadow: ${({theme}) => theme.shadows.lowered1};
`;

export const GoalValue = styled(FillValue)`
  background-color: ${({theme}) => theme.colors.blue};
`;

export const EmptyValue = styled.div`
  position: relative;
  background-color: ${({theme}) => theme.colors.redDark};
  width: 100%;
  height: 100%;
  box-shadow: ${({theme}) => theme.shadows.lowered1};
`;

export const StatusWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

export const StatusTextWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    position: absolute;
    font-size: ${({theme}) => theme.fontSizes.sm};
    font-weight: ${({theme}) => theme.fontWeights.bold};

    &.smallerText {
      font-size: ${({theme}) => theme.fontSizes.xs};
    }
  }

  // middle
  > div:nth-child(1) {
    font-size: ${({theme}) => theme.fontSizes.xl};
  }
  // top left
  > div:nth-child(2) {
    top: ${({theme}) => theme.spacings.xs};
    left: ${({theme}) => theme.spacings.xs};
  }
  // top right
  > div:nth-child(3) {
    top: ${({theme}) => theme.spacings.xs};
    right: ${({theme}) => theme.spacings.xs};
  }
  // bottom left
  > div:nth-child(4) {
    bottom: ${({theme}) => theme.spacings.xs};
    left: ${({theme}) => theme.spacings.xs};
  }
  // bottom right
  > div:nth-child(5) {
    bottom: ${({theme}) => theme.spacings.xs};
    right: ${({theme}) => theme.spacings.xs};
  }
`;

export const SellButtonsWrapper = styled.div`
  margin-top: ${({theme}) => theme.spacings.xs};

  > div {
    display: flex;
    gap: ${({theme}) => theme.spacings.xs};
  }
`;

export const SellButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 38px;
  background-color: ${({theme}) => theme.colors.white};
  color: ${({theme}) => theme.colors.black};
  font-size: ${({theme}) => theme.fontSizes.sm};
  text-shadow: none;
`;

export const SellButtonHalf = styled(SellButton)`
  margin-top: ${({theme}) => theme.spacings.xs};
  height: 30px;
  width: 50%;
`;

export const SellButtonFull = styled(SellButton)`
  margin-top: ${({theme}) => theme.spacings.xs};
  height: 30px;
  width: 100%;
`;
