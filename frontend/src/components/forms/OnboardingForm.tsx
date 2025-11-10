"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { onboardingSchema, OnboardingFormValues } from "@/lib/schema";
import { ProductSummaryDto } from "@/types/product.types";
import { Button, Input, CurrencyInput, Alert } from "@/components/ui";

interface OnboardingFormProps {
  products: ProductSummaryDto[];
  preselectedProductId?: string;
}

export function OnboardingForm({
  products,
  preselectedProductId,
}: OnboardingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: user?.email || "",
      initialAmount: 0,
      productId: preselectedProductId || "",
    },
  });

  const onSubmit: SubmitHandler<OnboardingFormValues> = async (data) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar la solicitud.");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 3500);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Ha ocurrido un error inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="¡Solicitud enviada!">
        Su solicitud está siendo procesada. Será redirigido en breve...
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <Alert variant="error" title="Error">
          {apiError}
        </Alert>
      )}

      <Input
        label="Nombre Completo"
        type="text"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Número de Documento"
        type="text"
        error={errors.documentNumber?.message}
        {...register("documentNumber")}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        error={errors.email?.message}
        disabled={!!user?.email}
        {...register("email")}
      />

      <Controller
        name="initialAmount"
        control={control}
        render={({ field }) => (
          <CurrencyInput
            label="Monto Inicial de Apertura"
            currency="USD"
            name={field.name}
            value={field.value}
            onValueChange={(v) => field.onChange(v ?? 0)}
            error={errors.initialAmount?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-black/70 mb-2">
          Producto a Contratar
        </label>
        <select
          {...register("productId")}
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) transition-colors"
        >
          <option value="">Seleccione un producto...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-2 text-sm text-red-600">
            {errors.productId.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud"}
      </Button>
    </form>
  );
}
