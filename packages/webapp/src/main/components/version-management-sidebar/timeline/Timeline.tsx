import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';
import { selectPreviewedDiagramIndex } from '../../../services/version-management/versionManagementSlice';
import { selectDiagram } from '../../../services/diagram/diagramSlice';
import { TimelineVersion } from './timeline-version/TimelineVersion';

const TimelineVersions = styled.div`
  max-height: 100%;
  margin: 0.75rem 0;
`;

export const Timeline: React.FC = () => {
  const diagram = useAppSelector(selectDiagram);
  const previewedDiagramIndex = useAppSelector(selectPreviewedDiagramIndex);
  const versions = diagram.versions ? diagram.versions : [];

  return (
    <div style={{ height: '100%' }}>
      <TimelineVersions>
        <TimelineVersion
          index={-1}
          isOnlyUnpublishedVersion={versions.length === 0}
          isPreviewedVersion={false}
          isLastVersion={false}
        />
        {versions
          .slice()
          .reverse()
          .map((version, index) => (
            <TimelineVersion
              key={index}
              index={versions.length - 1 - index}
              version={version}
              isPreviewedVersion={versions.length - 1 - index === previewedDiagramIndex}
              isLastVersion={index === versions.length - 1}
            />
          ))}
      </TimelineVersions>
    </div>
  );
};
