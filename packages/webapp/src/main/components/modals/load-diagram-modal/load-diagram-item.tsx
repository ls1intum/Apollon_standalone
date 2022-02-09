import React from 'react';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types.js';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state.js';
import { Locale } from '@ls1intum/apollon';
import { longDate } from '../../../constant.js';

const SubTitle = styled.span`
  display: block;
  font-size: small;
  color: #9e9e9e;
`;

type OwnProps = {
  item: LocalStorageDiagramListItem;
};

type StateProps = {
  locale: Locale;
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>((state) => {
  return {
    locale: state.editorOptions.locale,
  };
});

const LoadDiagramItemComponent = (props: Props) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="text-truncate pr-1">
        <span>{props.item.title}</span>
        <SubTitle>{props.item.type}</SubTitle>
      </div>
      <div className="flex-shrink-0">
        <SubTitle>last updated:</SubTitle>
        <SubTitle>{props.item.lastUpdate.locale(props.locale).format(longDate)}</SubTitle>
      </div>
    </div>
  );
};

export const LoadDiagramItem = enhance(LoadDiagramItemComponent);
