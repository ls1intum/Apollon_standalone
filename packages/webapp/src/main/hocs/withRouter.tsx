import React, { ComponentClass, FunctionComponent } from 'react';
import { Location, NavigateFunction, Params, useLocation, useNavigate, useParams } from 'react-router-dom';

export interface RouterTypes {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

export function withRouter<T extends RouterTypes>(WrappedComponent: ComponentClass<T>): FunctionComponent<T> {
  function ComponentWithRouterProp(props: T) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <WrappedComponent {...props} location={location} navigate={navigate} params={params} />;
  }

  return ComponentWithRouterProp as FunctionComponent<T>;
}
