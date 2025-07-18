// ...existing code...
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default async function ShopPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  const products = data as Product[] | null;

  if (error) {
    return <div className="text-red-500">Failed to load products.</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop Our Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
