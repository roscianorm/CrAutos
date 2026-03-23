import client from './client';
import type { Car } from '../types';

export interface CarFilters {
  maker?: string;
  year?: number;
  model?: string;
}

export async function getCars(filters: CarFilters = {}): Promise<Car[]> {
  const params = new URLSearchParams();
  if (filters.maker) params.append('maker', filters.maker);
  if (filters.year) params.append('year', filters.year.toString());
  if (filters.model) params.append('model', filters.model);

  const response = await client.get(`/api/cars?${params.toString()}`);
  return response.data;
}

export async function getCar(id: number): Promise<Car> {
  const response = await client.get(`/api/cars/${id}`);
  return response.data;
}

export async function createCar(formData: FormData): Promise<number> {
  const response = await client.post('/api/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}