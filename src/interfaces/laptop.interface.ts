export interface Laptop {
  id: number;
  name: string;
  brand: string;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  screen: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  category: 'gaming' | 'business' | 'ultrabook' | 'budget';
  isAvailable: boolean;
}