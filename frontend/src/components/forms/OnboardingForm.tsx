"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { onboardingSchema, OnboardingFormValues } from "@/lib/schema";
import { ProductSummaryDto } from "@/types/product.types";

interface OnboardingFormProps {
  products: ProductSummaryDto[];
}

export function OnboardingForm({ products }: OnboardingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: user?.email || "",
      initialAmount: 0,
      productId: "",
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
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

      alert(
        "¡Solicitud de onboarding recibida! Su validación está en proceso."
      );
      router.push("/");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          <p>{apiError}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre Completo
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="documentNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Número de Documento
        </label>
        <input
          id="documentNumber"
          type="text"
          {...register("documentNumber")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.documentNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.documentNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo Electrónico (Usuario)
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="initialAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Monto Inicial de Apertura
        </label>
        <input
          id="initialAmount"
          type="number"
          step="0.01"
          {...register("initialAmount")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.initialAmount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.initialAmount.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="productId"
          className="block text-sm font-medium text-gray-700"
        >
          Producto a Contratar
        </label>
        <select
          id="productId"
          {...register("productId")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">Seleccione un producto...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.productId.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud"}
      </button>
    </form>
  );
}
