"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/forms/LoginForm";
import { ArrowLeftIcon } from "@/components/icons";
import { Button, Container, Card, Section, LinkButton } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center bg-(--surface)">
      <Section spacing="lg" className="w-full">
        <Container size="md">
          <Card
            variant="default"
            className="flex flex-col lg:flex-row items-stretch gap-10 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden border-0"
          >
            <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center space-y-10">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="w-fit"
              >
                <ArrowLeftIcon size={20} />
                Volver
              </Button>

              <div className="space-y-2">
                <h1 className="font-brand text-3xl font-semibold text-black">
                  Iniciar sesión
                </h1>
                <p className="text-black/60 text-base leading-relaxed">
                  Descubre nuevas oportunidades financieras diseñadas para ti.
                </p>
              </div>

              <LoginForm className="bg-white rounded-2xl" />

              <div className="flex flex-col gap-2 text-sm text-black/60">
                <LinkButton
                  href="/forgot-password"
                  variant="ghost"
                  size="sm"
                  className="self-start text-(--primary) font-semibold hover:underline px-0 py-0"
                  aria-label="Recuperar contraseña"
                >
                  ¿Olvidaste tu contraseña?
                </LinkButton>
                <div className="flex items-center gap-2">
                  ¿Aún no tienes cuenta?
                  <LinkButton
                    href="/register"
                    variant="ghost"
                    size="sm"
                    className="text-(--primary) font-semibold hover:underline px-0 py-0"
                    aria-label="Ir a registro"
                  >
                    Regístrate
                  </LinkButton>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:w-[48%] relative">
              <div className="absolute inset-0 mix-blend-multiply opacity-80" />
              <Image
                src="/img/LOGIN.png"
                alt="Ilustración Numia"
                fill
                priority
                className="object-contain scale-x-[-1]"
                sizes="(max-width: 1200px) 50vw, 600px"
              />
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
