export const IProductLookupPort = Symbol('IProductLookupPort');

export interface IProductLookupPort {
  exists(productId: string): Promise<boolean>;
}
