import React from 'react';
import {isFinite} from 'lodash';
import {
  StyledGlobe,
  ManaBarWrapper,
  ManaBar,
  ManaBarFill,
  ManaBarLabel,
  HealthFill,
  HealthLabel,
} from './styles';

export interface IResourceGlobeProps {
  health: {
    current: number;
    max: number;
  };
  mana: {
    current: number;
    max: number;
  };
}

function getManaProgressDegrees(current: number, max: number) {
  const maxDegrees = 110;
  let percent = Math.min(1, current / max) * maxDegrees;
  if (!isFinite(percent)) percent = 0;
  return `${percent}deg`;
}

function getHealthProgressPercent(current: number, max: number) {
  let percent = (1 - Math.min(1, current / max)) * 100;
  if (!isFinite(percent)) percent = 0;
  return `${percent}%`;
}

export function ResourceGlobe({health, mana}: IResourceGlobeProps) {
  return (
    <StyledGlobe>
      <HealthLabel>{Math.floor(health.current).toLocaleString()}</HealthLabel>
      <HealthFill
        style={{
          // @ts-expect-error css variable
          '--progress': getHealthProgressPercent(health.current, health.max),
        }}
      />
      <ManaBarWrapper>
        <ManaBarLabel>
          {Math.floor(Math.max(0, mana.current)).toLocaleString()}
        </ManaBarLabel>
        <ManaBar />
        <ManaBarFill
          style={{
            // @ts-expect-error css variable
            '--progress': getManaProgressDegrees(mana.current, mana.max),
          }}
        />
      </ManaBarWrapper>
    </StyledGlobe>
  );
}
