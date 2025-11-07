export const ICacheService = Symbol('ICacheService');

export interface ICacheService {
  /**
   * Obtiene un valor de la caché.
   * @param key La clave a buscar.
   * @returns El valor (a menudo como string JSON) o null si no se encuentra.
   */
  get(key: string): Promise<string | null>;

  /**
   * Guarda un valor en la caché.
   * @param key La clave bajo la cual guardar.
   * @param value El valor (a menudo como string JSON) a guardar.
   * @param ttlSeconds El "Time To Live" o tiempo de expiración en segundos.
   */
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}
