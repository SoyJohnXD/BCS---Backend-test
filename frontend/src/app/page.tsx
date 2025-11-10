import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { Footer } from "@/components/footer/Footer";
import { Container, Section, Card } from "@/components/ui";
import { getProducts } from "@/services/product.service";

export default async function Home() {
  const data = await getProducts();
  const products = data?.products || [];
  const cookieStore = await cookies();
  void cookieStore.get("authToken");

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Section id="products" spacing="lg">
        <Container>
          {products.length === 0 ? (
            <Card variant="surface" className="p-12 text-center text-black/70">
              <p>No hay productos disponibles para mostrar en este momento.</p>
            </Card>
          ) : (
            <ProductCarousel products={products} />
          )}
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
