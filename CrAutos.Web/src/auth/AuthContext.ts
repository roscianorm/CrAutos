import { createContext } from 'react';
import type { User } from '../types';
import type { CredentialResponse } from '@react-oauth/google';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  requiresProfile: boolean;
  handleGoogleSuccess: (response: CredentialResponse) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);