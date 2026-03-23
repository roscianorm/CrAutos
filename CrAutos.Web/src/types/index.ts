// This file defines the TypeScript interfaces shared across the app

export interface Car {
  id: number;
  maker: string;
  year: number;
  model: string;
  province: string;
  canton: string;
  district: string;
  publishedAt: string;
  photoUrls: string[];
  whatsAppUrl: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  requiresProfile: boolean;
  user?: User;
}
