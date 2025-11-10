import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/forms/OnboardingForm";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Container, Card } from "@/components/ui";
import { PackageIcon } from "@/components/icons";
import { getProducts } from "@/services/product.service";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const data = await getProducts();
  const products = data?.products || [];
  const params = await searchParams;
  const preselectedProduct = params.productId
    ? {
        id: params.productId as string,
        name: params.productName as string,
        description: params.productDescription as string,
      }
    : undefined;

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <Container className="py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-brand text-3xl md:text-4xl font-semibold text-black mb-3">
              Solicitud de Apertura
            </h1>
            <p className="text-black/60 text-base leading-relaxed">
              Complete el formulario para iniciar su solicitud
            </p>
          </div>

          {preselectedProduct && (
            <Card variant="surface" className="p-6 mb-6 border-black/10">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center">
                  <PackageIcon size={24} className="text-(--primary)" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-1">
                    Producto seleccionado
                  </p>
                  <p className="font-brand text-lg font-semibold text-black">
                    {preselectedProduct.name}
                  </p>
                  <p className="text-sm text-black/60 mt-0.5">
                    {preselectedProduct.description}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-8 md:p-10">
            <OnboardingForm
              products={products}
              preselectedProductId={preselectedProduct?.id}
            />
          </Card>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
