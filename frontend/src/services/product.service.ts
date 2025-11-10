"use server";
import { serverApi } from "@/lib/api-client";
import type { ProductListDto, ProductDetailDto } from "@/types/product.types";

/**
 * Obtiene la lista de todos los productos disponibles
 * @returns Lista de productos o null en caso de error
 */
export async function getProducts(): Promise<ProductListDto | null> {
  try {
    const res = await serverApi("/products", { cache: "no-store" });

    if (!res.ok) {
      console.error("Error al obtener productos:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getProducts:", error);
    return null;
  }
}

/**
 * Obtiene los detalles de un producto específico por su ID
 * @param id - ID del producto
 * @returns Detalles del producto o null si no se encuentra
 */
export async function getProductById(
  id: string
): Promise<ProductDetailDto | null> {
  try {
    const res = await serverApi(`/products/${id}`, { cache: "no-store" });

    if (!res.ok) {
      console.error("Producto no encontrado:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getProductById:", error);
    return null;
  }
}
