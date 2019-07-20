import { Category } from './category.model';

export interface Product {
  name: string;
  ref: string;
  price: number;
  category: Category;
}
