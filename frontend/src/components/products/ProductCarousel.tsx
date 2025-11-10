"use client";

import { useRef } from "react";
import type { ProductSummaryDto } from "@/types/product.types";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui";

interface Props {
  products: ProductSummaryDto[];
}

export function ProductCarousel({ products }: Props) {
  const scroller = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: -1 | 1) => () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <div className="relative fade-in-up">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6 px-1">
        <div>
          <span className="uppercase tracking-[0.25em] text-xs text-black/50 font-semibold">
            Portafolio
          </span>
          <h2 className="font-brand text-3xl md:text-4xl font-semibold mt-2">
            Nuestros productos destacados
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label="Anterior"
            onClick={scroll(-1)}
            type="button"
            variant="outline"
            size="sm"
          >
            {" "}
            ‹
          </Button>
          <Button
            aria-label="Siguiente"
            onClick={scroll(1)}
            type="button"
            variant="outline"
            size="sm"
          >
            {" "}
            ›
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
