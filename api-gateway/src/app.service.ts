import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Proporciona el estado de salud del servicio.
   * @returns Un objeto que indica que el servicio está operativo.
   */
  getHealth(): { ok: boolean } {
    return { ok: true };
  }
}
