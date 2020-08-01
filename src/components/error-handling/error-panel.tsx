import React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { ApollonError } from '../../services/error-management/error-types';
import { ErrorMessage } from './error-message';
import { ErrorRepository } from '../../services/error-management/error-repository';

type OwnProps = {};

type DispatchProps = { dismissError: typeof ErrorRepository.dismissError };

type StateProps = { errors: ApollonError[] };

type Props = StateProps & DispatchProps & OwnProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => ({
    errors: state.errors,
  }),
  { dismissError: ErrorRepository.dismissError },
);

function ErrorPanelComponent(props: Props) {
  return (
    <>
      {props.errors.map((error, index) => (
        <ErrorMessage error={error} onClose={(apollonError: ApollonError) => props.dismissError(apollonError.id)} key={index} />
      ))}
    </>
  );
}

export const ErrorPanel = enhance(ErrorPanelComponent);
