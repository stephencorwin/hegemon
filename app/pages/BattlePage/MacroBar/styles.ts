import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
`;

export const MacroButton = styled.button`
  background-repeat: no-repeat;
  background-size: cover;
  height: 70px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  &::after {
    background-image: url('https://wow.zamimg.com/images/Icon/large/border/default.png');
    background-size: 114%;
    background-position: center;
    border-radius: 8px;
  }
`;

export const MacroButtonEmpty = styled(MacroButton)`
  cursor: auto;
  background-color: ${({theme}) => theme.colors.gray};
`;

export const Cost = styled.div`
  font-weight: ${({theme}) => theme.fontWeights.bold};
  font-size: ${({theme}) => theme.fontSizes.lg};
  z-index: 1;
`;

export const TrancheCirclesWrapper = styled.div`
  position: absolute;
  top: -8px;
  display: flex;
  flex-direction: row;
`;

export const TrancheCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 20px;
  height: 20px;
  padding: 1px 1px 0 0;
  border-radius: 100%;
  background-color: ${({theme}) => theme.colors.black};
  border: 1px solid;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: ${({theme}) => theme.shadows.raised1};
  font-size: ${({theme}) => theme.fontSizes.xs};
  z-index: 1;
  text-shadow: none;

  &.call {
    color: #00ff00;
  }

  &.put {
    color: #ff0000;
  }
`;
