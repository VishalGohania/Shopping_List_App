export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  purchased: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  success: boolean;
  items: Item[];
}

export interface CreateItemRequest {
  name: string;
  quantity: number;
  category?: string;
}

export interface UpdateItemRequest {
  name?: string;
  quantity?: number;
  category?: string;
  purchased?: boolean;
}
