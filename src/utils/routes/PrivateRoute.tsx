/* eslint-disable react/jsx-props-no-spreading */
import {FC} from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, removeSession } from '../storage/storage';

type RouteProps = {component: FC, path?: string }
// handle the private routes
function PrivateRoute({ component: Component, path, ...rest }: RouteProps) {
  if (getToken()) { 
    return <Component />;
  }
  removeSession();
  return <Navigate to="/login" />;
}

export default PrivateRoute;
