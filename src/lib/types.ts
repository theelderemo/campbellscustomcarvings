export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  material: string | null;
};

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes: string | null;
  product?: Product;
};

export type CustomOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  description: string;
  budget: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  images: string[] | null;
};
