import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, max-content));
  margin: 48px auto;
  width: max-content;
`;

const TableStyled = styled.div`
  width: 36px;
  height: 36px;
  background: #1e213b;
  z-index: 3;
  border-top: 2px solid #fff;
  border-bottom: 2px solid #fff;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 60px;
    width: 20px;
    background: #1e213b;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    border-radius: 12px;
    z-index: -1;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

    &::after {
      content: '';
      position: absolute;
      height: 20px;
      width: 60px;
      background: #1e213b;
      top: 50%;
      transform: translateY(-50%);
      left: -15px;
      border-radius: 12px;
      z-index: -1;
    }
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    &::after {
      content: '';
      position: absolute;
      height: 20px;
      width: 60px;
      background: #1e213b;
      top: 50%;
      transform: translateY(-50%);
      right: -15px;
      border-radius: 12px;
      z-index: -1;
    }
  }
`;

const Table = () => {
  return (
    <TableWrapper>
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <TableStyled key={`table-${i}`} />
        ))}
    </TableWrapper>
  );
};

export default Table;
