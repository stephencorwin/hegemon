import styled from 'styled-components';

export const StyledWrapper = styled.aside`
  position: fixed;
  display: grid;
  /* top: 183px; */
  top: 20px;
  right: 20px;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const Tile = styled.div`
  background-color: #000;
  height: 100px;
  width: 100px;
  box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 300;
  border: 3px solid;
  padding: 6px;

  &.positive {
    border-color: #00ae20;
  }
  &.negative {
    border-color: #f00000;
  }
  &.neutral {
    border-color: transparent;
  }

  hr {
    margin: 6px 0;
    width: 100%;
  }
`;

export const Symbol = styled.div`
  font-size: 20px;
  color: white;
`;

export const SubText = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);

  &.positive {
    color: #00ae20;
  }
  &.negative {
    color: #f00000;
  }
  &.neutral {
    color: rgb(135, 131, 131);
  }
`;

export const SubTextPropertyLabel = styled.span`
  color: white;
  font-weight: 300;
`;

export const SubTextsWrapper = styled.div`
  width: 100%;
  text-align: left;
  text-shadow: none;
`;
