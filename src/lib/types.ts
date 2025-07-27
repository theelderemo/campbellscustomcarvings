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

export type UserProfile = {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
};
