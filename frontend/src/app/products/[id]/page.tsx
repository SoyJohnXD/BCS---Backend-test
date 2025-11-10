import Image from "next/image";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CheckCircleIcon, ArrowLeftIcon } from "@/components/icons";
import { getProductImage } from "@/lib/product-images";
import { Container, Card, LinkButton } from "@/components/ui";
import { getProductById } from "@/services/product.service";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <Container className="py-16">
          <LinkButton href="/" variant="ghost" size="sm" className="mb-6">
            <ArrowLeftIcon size={20} />
            Volver
          </LinkButton>
          <Card variant="surface" className="p-10">
            <p className="text-black/70 mb-6">
              Producto no encontrado o no disponible.
            </p>
            <LinkButton href="/" variant="primary">
              Volver al inicio
            </LinkButton>
          </Card>
        </Container>
        <Footer />
      </main>
    );
  }

  const {
    name,
    shortDescription,
    description,
    benefits = [],
    eligibilityRequirements = [],
    interestRate,
    termsAndConditions,
    imageTags,
  } = product;

  const productImage = getProductImage({
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    tags: imageTags,
  });

  const onboardingParams = new URLSearchParams({
    productId: product.id,
    productName: name,
    productDescription: shortDescription,
  });

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <Container className="py-12 flex-1">
        <LinkButton href="/" variant="ghost" size="sm" className="mb-8">
          <ArrowLeftIcon size={20} />
          Volver
        </LinkButton>

        <Card
          variant="surface"
          className="p-4 md:p-12 mb-12 fade-in-up bg-white"
        >
          <div className="h-128 md:h-116 bg-linear-to-br rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
            <Image
              src={productImage}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 1200px"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="font-brand text-3xl md:text-5xl tracking-tight text-black">
              {name}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-black/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </Card>

        {benefits.length > 0 && (
          <section className="mb-12">
            <h2 className="font-brand text-2xl md:text-3xl mb-6 text-black">
              Beneficios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit: string, index: number) => (
                <Card key={index} hover className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircleIcon />
                    <p className="text-black/80 font-medium leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {interestRate !== undefined && (
            <Card className="p-6">
              <h3 className="font-brand text-xl mb-2 text-black">
                Tasa de interés competitiva
              </h3>
              <p className="text-4xl font-bold text-(--primary)">
                {interestRate}%
              </p>
            </Card>
          )}

          {eligibilityRequirements.length > 0 && (
            <Card className="p-6">
              <h3 className="font-brand text-xl mb-4 text-black">
                Requisitos de elegibilidad
              </h3>
              <ul className="space-y-3">
                {eligibilityRequirements.map((req: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-black/70"
                  >
                    <span className="text-(--primary) mt-1 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {termsAndConditions && (
          <Card className="p-6 mb-12">
            <h3 className="font-brand text-lg mb-2 text-black">
              Términos y Condiciones
            </h3>
            <p className="text-sm text-black/60 leading-relaxed">
              {termsAndConditions}
            </p>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <LinkButton
            href={`/onboarding?${onboardingParams.toString()}`}
            variant="primary"
          >
            Adquirir ahora
          </LinkButton>
          <LinkButton href="/" variant="ghost">
            Explorar más
          </LinkButton>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
