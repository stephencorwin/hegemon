import {createGlobalStyle} from 'styled-components';
import {normalize} from 'polished';

const normalized: any = normalize();

export const GlobalStyles = createGlobalStyle`
  ${normalized}

  * {
    box-sizing: inherit;
  }

  html {
    opacity: 1;

    font-size: ${({theme}) => theme.fontSizes.base};
    font-family: ${({theme}) => theme.fontFamilies.base};
    box-sizing: border-box;
    color: ${({theme}) => theme.colors.white};
    text-shadow: ${({theme}) => theme.shadows.textThin};
  }

  main {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  button {
    font-size: 1rem;
    padding: 0;
    position: relative;
    border: none;
    outline: none;
    cursor: pointer;
    color: ${({theme}) => theme.colors.white};
    text-shadow: ${({theme}) => theme.shadows.text};

    box-shadow: ${({theme}) => theme.shadows.raised1};
    &:hover {
      box-shadow: none;
    }
    &:active {
      box-shadow: ${({theme}) => theme.shadows.lowered1};
    }

    transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0,0,0,0);
      pointer-events: none;
    }

    &.selected {
      cursor: auto;
      &:hover,
      &:active {
        &::after {
          background-color: rgba(0,0,0,0);
        }
      }
    }

    &:hover, &:active {
      &::after {
        background-color: rgba(0,0,0,0.25);
      }
    }


    &:disabled {
      cursor: not-allowed;
      color: rgba(255,255,255,0.5);

      &, &:hover, &:active {
        box-shadow: ${({theme}) => theme.shadows.raised1};
      }

      &:hover {
        &::after {
          background-color: transparent;
        }
      }
    }
  }

  h1,h2,h3,h4,h5,h6,p {
    margin-top: 0;
    margin-bottom: ${({theme}) => theme.spacings.sm};
  }

  a {
    color: black;
    outline: none;
    cursor: pointer;
    text-decoration: none;

    &.active,
    &:hover {
      color: white;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* INPUT */
  input[type=text],
  input[type=number],
  input[type=search],
  input[type=email],
  input[type=password],
  textarea,
  select {
    border: none;
    color: ${({theme}) => theme.colors.black};
    outline: none;
    width: 100%;
    font-family: inherit;
  }

  input[type=number] {
    text-align: center;
  }

  input[type=checkbox] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  textarea {
    max-width: 100%;
    min-width: 100%;
  }
`;
