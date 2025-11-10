"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND_TAGLINE, BRAND_SUBTAGLINE } from "@/lib/brand";
import { ArrowDown } from "phosphor-react";

export function Hero() {
  return (
    <section className="w-full">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center px-6 md:px-12 py-16 md:py-24">
        <div className="order-2 md:order-1 flex justify-center fade-in-up relative h-[320px] md:h-[420px] lg:h-[480px]">
          <Image
            src="/img/HERO.png"
            alt="Numia, banca digital moderna"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-contain"
            priority
          />
        </div>

        <div
          className="order-1 md:order-2 space-y-8 fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="font-brand text-4xl/[1.05] md:text-5xl/[1.05] tracking-tight text-balance font-semibold">
            {BRAND_TAGLINE}
          </h1>
          <p className="text-xl text-black/70 max-w-xl font-medium leading-relaxed">
            {BRAND_SUBTAGLINE}
          </p>

          <div className="flex items-center gap-5">
            <Link href="#products" className="btn-primary text-base">
              Explorar productos
            </Link>
            <a href="#products" className="btn-ghost text-sm font-semibold">
              Desliza para ver más <ArrowDown size={32} />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-[0.4em] text-black/40">
            <span className="h-px flex-1 bg-black/30" />
            Confianza · Seguridad · Cercanía
            <span className="h-px flex-1 bg-black/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
