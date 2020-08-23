import { ListGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { LoadDiagramItem } from './load-diagram-item';

type Props = {
  diagrams: LocalStorageDiagramListItem[];
  onSelect: (diagramListItemId: string) => void;
};

export const LoadDiagramContent = (props: Props) => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | undefined>(undefined);

  const onSelect = (diagramId: string) => {
    setSelectedDiagramId(diagramId);
    props.onSelect(diagramId);
  };

  if (props.diagrams && props.diagrams.length > 0) {
    return (
      <ListGroup>
        {props.diagrams.map((value, index, array) => (
          <ListGroup.Item
            key={value.id}
            action
            onClick={(event: any) => onSelect(value.id)}
            active={selectedDiagramId ? selectedDiagramId === value.id : false}
          >
            <LoadDiagramItem item={value} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  } else {
    return <div>You do not have any diagrams stored.</div>;
  }
};
