
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-zinc-900 text-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        {product.images && product.images.length > 0 && (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={192}
            className="w-full h-48 object-cover bg-zinc-800"
            priority
          />
        )}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
          <p className="text-green-400 font-bold mb-4">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </Link>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 m-4 rounded transition-colors"
        type="button"
      >
        Quick Add
      </button>
    </div>
  );
}
