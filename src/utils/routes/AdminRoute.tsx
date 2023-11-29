/* eslint-disable react/jsx-props-no-spreading */
import {FC} from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getRole, removeSession } from '../storage/storage';

type RouteProps = {component: FC, path?: string }
// handle the admin routes
function AdminRoute({ component: Component, path, ...rest }: RouteProps) {
  if (getToken()) {
    if (getRole() === 'Admin') {
      return <Component />;
    }
    return <Navigate to="/" />;
  }
  removeSession();
  return <Navigate to="/login" />;
}

export default AdminRoute;
