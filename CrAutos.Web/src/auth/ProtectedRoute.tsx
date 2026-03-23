import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { PropsWithChildren } from 'react';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}