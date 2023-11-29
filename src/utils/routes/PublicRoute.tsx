/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../storage/storage';

type RouteProps = {component: FC }

// handle the public routes
function PublicRoute({ component: Component}: RouteProps) {
  if (getToken()) {
    return <Navigate to="/" />;
  }
  return <Component />;
}

export default PublicRoute;
