import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { User } from '../types';
import { googleLogin } from '../api/auth';
import type { CredentialResponse } from '@react-oauth/google';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function getStoredUser(): User | null {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresProfile, setRequiresProfile] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    try {
      setIsLoading(true);
      const result = await googleLogin(response.credential);
      localStorage.setItem('jwt', result.token);
      if (result.requiresProfile) {
        setRequiresProfile(true);
        navigate('/profile');
      } else if (result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRequiresProfile(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      requiresProfile,
      handleGoogleSuccess,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}