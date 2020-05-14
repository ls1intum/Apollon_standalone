import { ApplicationState } from './application-state';
import React, { Component, PropsWithChildren } from 'react';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Dispatch,
  Reducer,
  Store,
  StoreEnhancer,
  PreloadedState,
} from 'redux';
import { Actions } from '../../services/actions';
import { reducers } from '../../services/reducer';
import { Provider } from 'react-redux';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import epics from '../../services/epics';

type OwnProps = PropsWithChildren<{
  initialState: PreloadedState<ApplicationState>;
}>;

type Props = OwnProps;

const getInitialState = (
  initialState: PreloadedState<ApplicationState>,
): { store: Store<ApplicationState, Actions> } => {
  const reducer: Reducer<ApplicationState, Actions> = combineReducers<ApplicationState, Actions>(reducers);
  const epicMiddleware: EpicMiddleware<Actions, Actions, ApplicationState> = createEpicMiddleware();

  const middleware: StoreEnhancer<{ dispatch: Dispatch }, {}> = applyMiddleware(epicMiddleware);

  const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(middleware);

  const store: Store<ApplicationState, Actions> = createStore(reducer, initialState, enhancer);

  epicMiddleware.run(epics);

  return { store };
};

type State = ReturnType<typeof getInitialState>;

export class ApplicationStore extends Component<Props, State> {
  state = getInitialState(this.props.initialState);

  render() {
    return <Provider store={this.state.store}>{this.props.children}</Provider>;
  }
}
