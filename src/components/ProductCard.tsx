import React from "react";
import type { Product } from "@/lib/types";

type ProductCardProps = { product: Product };

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
    <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
    <p className="mb-2">{product.description}</p>
    <div className="font-bold">${product.price}</div>
  </div>
);

export default ProductCard;
