import { User } from '@/domain/entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  /**
   * Busca un usuario por su email.
   * @param email El email del usuario.
   * @returns Una promesa que resuelve a la entidad User o null si no se encuentra.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Guarda (crea o actualiza) un usuario en la base dedatos.
   * @param user La entidad User a guardar.
   */
  save(user: User): Promise<void>;
}
