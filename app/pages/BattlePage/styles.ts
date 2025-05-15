import {LimitBreak} from './LimitBreak';
import {MacroBar} from './MacroBar';
import styled from 'styled-components';

export const Main = styled.main`
  background-image: url('/assets/battle-background_02.jpg');
`;

export const LimitBreakLeft = styled(LimitBreak)`
  position: fixed;
  bottom: 20px;
  left: calc(100vw / 2 - 125px / 2 - 20px);
  transform: translate(-100%);
`;

export const MacroBarLeft = styled(MacroBar)`
  position: fixed;
  bottom: 60px;
  left: calc(100vw / 2 - 125px / 2 - 20px);
  transform: translate(-100%);
`;

export const MacroBarRight = styled(MacroBar)`
  position: fixed;
  bottom: 60px;
  right: calc(100vw / 2 - 125px / 2 - 20px);
  transform: translate(+100%);
`;

export const TileWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const ScrollContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding-right: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LogoutButton = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 30px;
  text-align: center;
  background-color: ${({theme}) => theme.colors.grayDark};
  color: ${({theme}) => theme.colors.black};
  font-size: ${({theme}) => theme.fontSizes.sm};
  text-shadow: none;
`;
