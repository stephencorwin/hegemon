import {useHegemon} from '../../../hooks';
import React from 'react';
import {Container, ButtonsWrapper, Button} from './styles';
import clsx from 'clsx';

export interface ILimitBreakProps {
  style?: React.CSSProperties;
  className?: string;
}

export function LimitBreak({style, className}: ILimitBreakProps) {
  const {snapshot, store} = useHegemon();
  const {profile} = snapshot;
  const {
    settings: {limitBreak},
  } = profile;

  return (
    <Container style={style} className={className}>
      LIMIT BREAK:
      <ButtonsWrapper>
        {limitBreak.levels.map((level) => (
          <Button
            key={level}
            className={clsx({
              selected: !limitBreak.maxOverride && limitBreak.current === level,
            })}
            onClick={() => {
              store.profile.settings.limitBreak.maxOverride = false;
              store.profile.settings.limitBreak.current = level;
            }}
          >
            <div>
              {level}
              <span>x</span>
            </div>
          </Button>
        ))}

        <Button
          className={clsx({selected: limitBreak.maxOverride})}
          onClick={() =>
            (store.profile.settings.limitBreak.maxOverride =
              !limitBreak.maxOverride)
          }
          title="Maximum Potential Limit Break"
        >
          <div>∞</div>
        </Button>
      </ButtonsWrapper>
    </Container>
  );
}
