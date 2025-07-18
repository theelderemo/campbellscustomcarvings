export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  material: string | null;
};
