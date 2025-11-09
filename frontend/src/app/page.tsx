import Link from "next/link";
import { serverApi } from "@/lib/api-client";
import { ProductListDto } from "@/types/product.types";

/**
 * Obtiene los productos desde el backend (servidor a servidor).
 *
 * Esta función aísla la lógica de obtención de datos y maneja
 * errores de forma segura en caso de que el servicio no esté disponible.
 * @returns Una promesa que resuelve al DTO de la lista de productos.
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
    console.error("Error al obtener productos (SSR):", error);
    return { products: [] };
  }
}

/**
 * Página principal (Landing Page).
 *
 * Este es un Componente de Servidor (RSC) asíncrono.
 * Obtiene la lista pública de productos directamente desde el api-gateway
 * durante el renderizado en el servidor.
 */
export default async function Home() {
  const { products } = await getProducts();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-gray-50">
      <div className="w-full max-w-5xl">
        <header className="flex justify-between items-center mb-10 pb-4 border-b">
          <h1 className="text-3xl font-bold text-gray-900">
            Productos Bancarios
          </h1>
          <Link
            href="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </header>

        {products.length === 0 ? (
          <div className="text-center text-gray-600 p-10 bg-white rounded-lg shadow">
            <p>No hay productos disponibles para mostrar en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white transition-shadow hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.shortDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
