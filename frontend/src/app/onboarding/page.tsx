import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api-client";
import { ProductListDto } from "@/types/product.types";
import { OnboardingForm } from "@/components/forms/OnboardingForm";

/**
 * Obtiene los productos desde el backend (servidor a servidor).
 */
async function getProducts(): Promise<ProductListDto> {
  try {
    const response = await serverApi("/products", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error del backend: ${response.status}`);
    }

    const data: ProductListDto = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos (SSR /onboarding):", error);
    return { products: [] };
  }
}

/**
 * Página de Onboarding de Cliente.
 *
 * Este es un Componente de Servidor (RSC) asíncrono.
 *
 * 1. Protege la ruta verificando la cookie de sesión en el servidor.
 * 2. Obtiene la lista de productos del backend (S2S).
 * 3. Renderiza el <OnboardingForm> (componente cliente) pasándole los productos.
 */
export default async function OnboardingPage() {
  // 1. Protección de Ruta (Servidor)
  // Se llama a .get() directamente desde la función cookies()
  const token = cookies().get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  // 2. Obtención de Datos (Servidor)
  const { products } = await getProducts();

  // 3. Renderizado
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Solicitud de Apertura
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Complete el formulario para iniciar su solicitud.
        </p>
        <OnboardingForm products={products} />
      </div>
    </main>
  );
}
