import React from 'react';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { Locale } from '@ls1intum/apollon';
import { longDate } from '../../../constant';

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

const enhance = connect<StateProps, DispatchProps, Props, ApplicationState>((state) => {
  return {
    locale: state.editorOptions.locale,
  };
});

const LoadDiagramItemComponent = (props: Props) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <span>{props.item.title}</span>
        <SubTitle>{props.item.type}</SubTitle>
      </div>
      <div>
        <SubTitle>last updated:</SubTitle>
        <SubTitle>{props.item.lastUpdate.locale(props.locale).format(longDate)}</SubTitle>
      </div>
    </div>
  );
};

export const LoadDiagramItem = enhance(LoadDiagramItemComponent);
