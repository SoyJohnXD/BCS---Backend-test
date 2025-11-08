import {
  Body,
  Controller,
  Logger,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateStatusRequestDto } from '@/presentation/dto/update-status-request.dto';
import { UpdateOnboardingStatusUseCase } from '@/application/use-cases/update-onboarding-status.use-case';

@Controller('internal/onboarding')
export class InternalController {
  private readonly logger = new Logger(InternalController.name);

  constructor(
    private readonly updateStatusUseCase: UpdateOnboardingStatusUseCase,
  ) {}

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOnboardingStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusRequestDto,
  ): Promise<void> {
    this.logger.log(
      `Callback recibido para ID: ${id}, Nuevo Estado: ${updateStatusDto.status}`,
    );

    await this.updateStatusUseCase.execute({
      id: id,
      status: updateStatusDto.status,
    });
  }
}
