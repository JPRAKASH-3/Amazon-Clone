export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  status: string;
  createdAt: string;
}
