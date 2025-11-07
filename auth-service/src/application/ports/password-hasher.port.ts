export const IPasswordHasher = Symbol('IPasswordHasher');

export interface IPasswordHasher {
  /**
   * Genera un hash a partir de un texto plano.
   * @param plainText El texto a hashear.
   * @returns Una promesa que resuelve al hash.
   */
  hash(plainText: string): Promise<string>;

  /**
   * Compara un texto plano con un hash.
   * @param plainText El texto a comparar.
   * @param hash El hash almacenado en la base de datos.
   * @returns Una promesa que resuelve a true si coinciden, false si no.
   */
  compare(plainText: string, hash: string): Promise<boolean>;
}
