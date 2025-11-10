"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormValues, loginSchema } from "@/lib/schema";
import { Button, Input, Alert } from "@/components/ui";

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className = "" }: LoginFormProps) => {
  const router = useRouter();
  const { login } = useAuth();

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password.trim(),
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setApiError(responseData.message || "Error al iniciar sesión");
        return;
      }
      login(responseData.user);
      router.push("/onboarding");
    } catch (error) {
      console.error("Error en login:", error);
      setApiError("No se pudo conectar al servidor. Intente más tarde.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${className}`.trim()}
    >
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <Input
        type="email"
        label="Email"
        autoComplete="email"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        type="password"
        label="Contraseña"
        autoComplete="current-password"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? "password-error" : undefined}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full justify-center text-base"
      >
        Ingresar
      </Button>
    </form>
  );
};
