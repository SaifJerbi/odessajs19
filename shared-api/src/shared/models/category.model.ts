import { Product } from './product.model';

export interface Category {
  name: string;
  description: string;
  products?: Product[];
}
