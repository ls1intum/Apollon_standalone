import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

type Props = {
  numberOfClients: number;
};

export const IconContainer = styled.div`
  color: #353d47;
  background-color: white;
  border-radius: 0.75rem;
  height: 1.5rem;
  width: 1.5rem;
  padding-left: 0.25rem;
  margin-left: 0.5rem;
  &:first-of-type {
    margin-left: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  max-width: 25%;
  overflow-x: auto;
`;

export function ConnectClientsComponent(props: Props) {
  const { numberOfClients } = props;
  const elements = Array.from({ length: numberOfClients }).fill(
    <IconContainer>
      <FontAwesomeIcon icon="pen-fancy" />
    </IconContainer>,
  );

  return <Container>{elements}</Container>;
}
