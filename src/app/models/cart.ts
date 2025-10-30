import { Fruit } from './fruit';

export interface CartItem {
  fruit: Fruit;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}
