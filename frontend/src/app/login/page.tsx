"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/forms/LoginForm";

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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Acceder a tu Cuenta
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
