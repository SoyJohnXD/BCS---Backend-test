import Link from "next/link";
import { cookies } from "next/headers";
import { BANK_NAME } from "@/lib/brand";
import { LinkButton } from "@/components/ui";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("authToken")?.value);

  return (
    <nav className="w-full sticky top-0 z-20 backdrop-blur-md bg-[rgba(255,233,227,0.8)]/90">
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-6 px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white font-brand text-3xl font-bold transition-transform duration-200 group-hover:scale-105">
            N
          </span>
          <span className="flex flex-col">
            <span className="font-brand text-3xl font-semibold tracking-tight text-black">
              {BANK_NAME}
            </span>
            <span className="hidden md:inline text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
              Banca Digital Inteligente
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <LinkButton href="/login" variant="primary" size="sm">
              Iniciar Sesión
            </LinkButton>
          )}
        </div>
      </div>
    </nav>
  );
}
