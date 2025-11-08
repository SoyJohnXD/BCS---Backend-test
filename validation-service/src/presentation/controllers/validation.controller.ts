import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { SimulateValidationUseCase } from '@/application/use-cases/simulate-validation.use-case';
import { ValidationRequestDto } from '../dto/validation-request.dto';

@Controller('validate')
export class ValidationController {
  constructor(
    private readonly simulateValidationUseCase: SimulateValidationUseCase,
  ) {}

  @Post()
  @HttpCode(202)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  startValidation(@Body() requestDto: ValidationRequestDto): {
    message: string;
  } {
    void this.simulateValidationUseCase.execute(requestDto);

    return { message: 'Validation request received and is being processed.' };
  }
}
