import axios from 'axios';
import type { AuthResponse, CreateItemRequest, Item, ItemsResponse, UpdateItemRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', { email, password, name });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get<ItemsResponse>('/items');
  console.log('API Response:', response.data);
  return response.data.items || [];
};

export const createItem = async (data: CreateItemRequest): Promise<Item> => {
  const response = await api.post('/items', data);
  return response.data.item;
};

export const updateItem = async (id: string, data: UpdateItemRequest): Promise<Item> => {
  const response = await api.put(`/items/${id}`, data);
  return response.data.item;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`);
};

export default api;
