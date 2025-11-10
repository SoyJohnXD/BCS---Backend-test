import Link from "next/link";
import Image from "next/image";
import type { ProductSummaryDto } from "@/types/product.types";
import { getProductImage } from "@/lib/product-images";

interface Props {
  product: ProductSummaryDto;
}

export function ProductCard({ product }: Props) {
  const img = getProductImage({
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    tags: product.tags,
  });
  return (
    <Link
      href={`/products/${product.id}`}
      className="card block min-w-[320px] max-w-[340px] snap-start overflow-hidden hover-lift"
    >
      <div className="relative w-full aspect-3/2 bg-white">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-contain p-6"
          sizes="(max-width:768px) 300px, 340px"
        />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-brand text-xl font-semibold text-black">
          {product.name}
        </h3>
        <p className="text-sm text-black/70 line-clamp-4 leading-relaxed font-medium">
          {product.shortDescription}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Ver detalle →
        </span>
      </div>
    </Link>
  );
}
