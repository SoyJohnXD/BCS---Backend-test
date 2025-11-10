import { BANK_NAME } from "@/lib/brand";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto border-t border-black/10 bg-white/60 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-6 md:px-12 py-10 text-sm text-black/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-semibold text-black/70">
          © {year} {BANK_NAME}. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-xs uppercase tracking-[0.3em]">
          <span>Hecho con Next.js</span>
          <span>Infraestructura segura</span>
        </div>
      </div>
    </footer>
  );
}
