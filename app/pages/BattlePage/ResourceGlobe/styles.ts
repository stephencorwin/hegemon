import styled from 'styled-components';

export const StyledGlobe = styled.aside`
  position: fixed;
  bottom: 30px;
  left: calc(100vw / 2);
  transform: translate(-50%);
  width: 125px;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 100%;
  background: ${({theme}) => theme.gradients.sphere(theme.colors.redDark)};
  box-shadow: ${({theme}) => theme.shadows.raised2};
`;

export const HealthFill = styled.div`
  background: ${({theme}) => theme.gradients.sphere(theme.colors.green)};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;

  --progress: 0%;
  transition: 0.5s clip-path ease;
  clip-path: inset(var(--progress) 0 0 0);
`;

export const HealthLabel = styled.label`
  position: relative;
  z-index: 1;
  font-size: ${({theme}) => theme.fontSizes.lg};
  text-shadow: ${({theme}) => theme.shadows.text};
`;

export const ManaBarWrapper = styled.div`
  position: absolute;
  top: -30px;
  width: 189px;
`;

export const ManaBar = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  aspect-ratio: 1;
  padding: 25px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.blueLight};
  transform: rotateZ(-55deg);

  --progress: 110deg;
  mask:
    linear-gradient(#0000 0 0) content-box intersect,
    conic-gradient(#000 var(--progress), #0000 0);
`;

export const ManaBarFill = styled(ManaBar)`
  background: ${({theme}) => theme.colors.blue};
`;

export const ManaBarLabel = styled.label`
  position: relative;
  z-index: 1;
  display: inline-block;
  position: absolute;
  top: 5px;
  width: 100%;
  text-align: center;
  font-size: ${({theme}) => theme.fontSizes.sm};
`;
