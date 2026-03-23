import client from './client';
import type { AuthResponse } from '../types';

export async function googleLogin(idToken: string): Promise<AuthResponse> {
  const response = await client.post('/auth/google', { idToken });
  return response.data;
}

export async function completeProfile(
  fullName: string,
  phoneNumber: string
): Promise<AuthResponse> {
  const response = await client.post('/auth/complete-profile', {
    fullName,
    phoneNumber,
  });
  return response.data;
}