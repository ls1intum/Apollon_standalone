import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import styled from 'styled-components';
import { Circle, Eye, Pencil, PlusLg, RecordCircle, Trash } from 'react-bootstrap-icons';
import { VersionActionsMenu } from './menues/version-actions-menu';
import { ModalRepository } from '../../services/modal/modal-repository';
import { ModalContentType } from '../modals/application-modal-types';
import { Diagram } from '../../services/diagram/diagram-types';

const TimelineContainer = styled.div`
  position: fixed;
  top: auto;
  bottom: auto;
  width: 250px;
  height: 100%;
  right: 0;
  background-color: var(--apollon-background);
  border-left: 1px solid #e6e6e6;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 1px solid #e6e6e6;
  color: var(--apollon-background-inverse);
`;

const NewVersionButton = styled.div`
  & {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease-in;
  }

  &:hover {
    color: #6f7174;
  }
`;

const Timeline = styled.div`
  overflow-y: auto;
  max-height: 100%;
  margin: 1rem 0;
`;

const TimelineVersion = styled.div`
  position: relative;
  padding: 0.25rem 0.75rem;
  display: inline-flex;
  width: 100%;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: calc(100% + 0.5em);
  background-color: #e6e6e6;
  position: absolute;
  z-index: -1;
  top: 0;
`;

const FirstVerticalLine = styled.div`
  width: 1px;
  height: 100%;
  background-color: #e6e6e6;
  position: absolute;
  margin-top: 20px;
  z-index: -1;
  top: 0;
`;

const VersionPosition = styled.div`
  flex-shrink: 0;
  border-radius: 5px;
  margin-right: 0.25rem;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  background-color: var(--apollon-background);
  color: var(--apollon-background-inverse);

  svg {
    z-index: 1;
  }
`;

const Version = styled.div`
  & {
    min-height: 23px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    background-color: #f3f3f3;
    border-radius: 0.25rem;
    transition: 0.2s ease-in;
    width: 100%;
    box-sizing: border-box;
  }
`;

const VersionActions = styled.div`
  display: flex;
  margin-top: 0.25rem;
`;

const ActionButton = styled.div`
  & {
    padding: 0.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: #f3f3f3;
    border-radius: 0.25rem;
    transition: 0.2s ease-in;
  }

  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }
`;

const PreviewActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;

  div {
    font-size: 0.75rem;
    border-radius: 0.25rem;
    transition: 0.2s ease-in;
    padding: 0.25rem;
  }

  div:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }
`;

type OwnProps = {};

type State = { previewedDiagramIndex: number };

type StateProps = { diagram: Diagram | null };

type DispatchProps = {
  openModal: typeof ModalRepository.showModal;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      diagram: state.diagram,
    };
  },
  {
    openModal: ModalRepository.showModal,
  },
);

const getInitialState = () => {
  return {
    previewedDiagramIndex: -1,
  };
};

class VersionManagementSidebarComponent extends Component<Props, State> {
  state = getInitialState();

  previewVersion(index: number) {
    // TODO
    this.setState({ previewedDiagramIndex: index });
  }

  exitPreview() {
    // TODO
    this.setState({ previewedDiagramIndex: -1 });
  }

  formatLastUpdated(lastUpdated: Date) {
    // TODO
    return `${lastUpdated.getMonth()}/${lastUpdated.getDate()}/${lastUpdated.getFullYear()} ${String(
      lastUpdated.getHours(),
    ).padStart(2, '0')}:${String(lastUpdated.getMinutes()).padStart(2, '0')}`;
  }

  render() {
    console.log(this.props.diagram);

    return (
      <TimelineContainer>
        <TimelineHeader>
          <div>Version History</div>
          <NewVersionButton
            onClick={() => {
              this.props.openModal(ModalContentType.CreateVersionModal, 'lg');
            }}
          >
            <PlusLg style={{ width: '18px', height: '18px' }} />
          </NewVersionButton>
        </TimelineHeader>
        <div style={{ height: '100%' }}>
          <Timeline>
            <TimelineVersion>
              <VersionPosition>
                {this.props.diagram && this.props.diagram.versions && this.props.diagram.versions.length !== 0 && (
                  <FirstVerticalLine />
                )}
                {this.state.previewedDiagramIndex === -1 ? <RecordCircle /> : <Circle />}
              </VersionPosition>
              <Version>
                <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>Current Unpublished Version</div>
              </Version>
            </TimelineVersion>
            {(this.props.diagram?.versions ? this.props.diagram.versions : [])
              .slice()
              .reverse()
              .map((version, index) => (
                <TimelineVersion key={index}>
                  <VersionPosition>
                    {this.props.diagram &&
                      this.props.diagram.versions &&
                      index !== this.props.diagram.versions.length - 1 && <VerticalLine />}
                    {index === this.state.previewedDiagramIndex ? <RecordCircle /> : <Circle />}
                  </VersionPosition>
                  <Version>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{version.title}</div>
                    <div style={{ fontWeight: 400, fontSize: '0.8rem' }}>{version.description}</div>
                    <div style={{ fontWeight: 300, fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {this.formatLastUpdated(version.lastUpdate.toDate())}
                    </div>
                    <VersionActions>
                      <ActionButton
                        onClick={() => {
                          this.props.openModal(ModalContentType.EditVersionInfoModal, 'lg');
                        }}
                      >
                        <Pencil />
                      </ActionButton>
                      <ActionButton
                        onClick={() => {
                          this.props.openModal(ModalContentType.DeleteVersionModal, 'lg');
                        }}
                      >
                        <Trash />
                      </ActionButton>
                      <ActionButton
                        onClick={() => {
                          this.previewVersion(index);
                        }}
                      >
                        <Eye />
                      </ActionButton>
                    </VersionActions>
                    {index === this.state.previewedDiagramIndex && (
                      <PreviewActions>
                        <div
                          onClick={() => {
                            this.exitPreview();
                          }}
                        >
                          Exit preview
                        </div>
                        <div
                          onClick={() => {
                            this.props.openModal(ModalContentType.RestoreVersionModal, 'lg');
                          }}
                        >
                          Restore version
                        </div>
                      </PreviewActions>
                    )}
                    {/* <VersionActionsMenu /> */}
                  </Version>
                </TimelineVersion>
              ))}
          </Timeline>
        </div>
      </TimelineContainer>
    );
  }
}

export const VersionManagementSidebar = enhance(VersionManagementSidebarComponent);
