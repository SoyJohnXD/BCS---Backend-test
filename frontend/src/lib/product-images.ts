export const PRODUCT_IMAGE_BY_TAG: Record<string, string> = {
  credito: "/img/products/credit.png",
  tarjeta: "/img/products/credit.png",
  card: "/img/products/credit.png",
  billetera: "/img/products/digital-wallet.png",
  wallet: "/img/products/digital-wallet.png",
  digital: "/img/products/digital-wallet.png",
  inversion: "/img/products/invest.png",
  invest: "/img/products/invest.png",
  fondos: "/img/products/invest.png",
  prestamo: "/img/products/loan.png",
  loan: "/img/products/loan.png",
  financiamiento: "/img/products/loan.png",
  hipoteca: "/img/products/loan.png",
  ahorro: "/img/products/savings.png",
  savings: "/img/products/savings.png",
  cuenta: "/img/products/savings.png",
};

const SAVINGS_VARIANTS = [
  "/img/products/savings.png",
  "/img/products/savings-two.png",
];

function pickSavingsVariant(stableKey?: string) {
  if (!stableKey) return SAVINGS_VARIANTS[0];
  const hash = Array.from(stableKey).reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0
  );
  return SAVINGS_VARIANTS[hash % SAVINGS_VARIANTS.length];
}

export function getProductImage(opts: {
  id?: string;
  name?: string;
  shortDescription?: string;
  tags?: string[] | null;
}): string {
  const tags = (opts.tags || []).map((t) => t.toLowerCase());
  for (const t of tags) {
    if (t in PRODUCT_IMAGE_BY_TAG) {
      if (t === "ahorro" || t === "savings" || t === "cuenta") {
        return pickSavingsVariant(opts.id || opts.name || "");
      }
      return PRODUCT_IMAGE_BY_TAG[t];
    }
  }
  const hay = (s?: string) => (s || "").toLowerCase();
  const blob = `${hay(opts.name)} ${hay(opts.shortDescription)}`;
  const includes = (kw: string) => blob.includes(kw);

  if (includes("prestamo") || includes("loan") || includes("hipoteca"))
    return PRODUCT_IMAGE_BY_TAG["loan"];
  if (includes("tarjeta") || includes("credito") || includes("card"))
    return PRODUCT_IMAGE_BY_TAG["credito"];
  if (includes("billetera") || includes("wallet") || includes("digital"))
    return PRODUCT_IMAGE_BY_TAG["wallet"];
  if (includes("inversion") || includes("fondos") || includes("invest"))
    return PRODUCT_IMAGE_BY_TAG["inversion"];
  if (includes("ahorro") || includes("cuenta") || includes("savings"))
    return pickSavingsVariant(opts.id || opts.name || "");

  return "/img/products/digital-wallet.png";
}
