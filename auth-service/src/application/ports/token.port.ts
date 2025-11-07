export const ITokenService = Symbol('ITokenService');

export interface ITokenService {
  /**
   * Genera un token firmado para un payload específico.
   * @param payload El contenido del token (ej: { sub: userId, email: userEmail })
   * @returns Una promesa que resuelve al string del token (ej: "eyJhb...")
   */
  sign(payload: { sub: string; email: string }): Promise<string>;
}
