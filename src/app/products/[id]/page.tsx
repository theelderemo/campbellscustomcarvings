import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="bg-zinc-900 rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8">
        {product.images && product.images.length > 0 && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full md:w-80 h-64 object-cover rounded bg-zinc-800"
          />
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-green-400 text-xl font-bold mb-4">
              {product.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            <p className="mb-6 text-zinc-300">{product.description}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors w-full md:w-auto">
            Quick Add
          </button>
        </div>
      </div>
    </main>
  );
}
