import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint de comprobación de estado.
   * Responde a GET /health
   * @returns Un objeto que indica que el servicio está operativo.
   */
  @Get('health')
  getHealth(): { ok: boolean } {
    return this.appService.getHealth();
  }
}
