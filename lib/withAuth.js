'use client';

import React from 'react';
import { useAuth } from './AuthContext';

export function withAuth(Component) {
  return function WrappedComponent(props) {
    const auth = useAuth();
    return <Component {...props} auth={auth} />;
  };
}
