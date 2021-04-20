import React from 'react';
import styled from 'styled-components';

type Props = {
  collaborators: string[];
};

export const NameContainer = styled.div`
  color: #353d47;
  background-color: white;
  border-radius: 0.75rem;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.5rem;
  text-transform: capitalize;
  &:first-of-type {
    margin-left: 0;
  }
  cursor: pointer;
  text-align: center;
`;

export const Container = styled.div`
  display: flex;
  max-width: 25%;
  overflow-x: auto;
`;

export function ConnectClientsComponent(props: Props) {
  const { collaborators } = props;
  const elements = collaborators.map((collaborator) => (
    <NameContainer title={collaborator || 'Anonymous'}>
      {collaborator ? collaborator.substring(0, 1) : 'A'}
    </NameContainer>
  ));

  return <Container>{elements}</Container>;
}
