import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OnboardingRequestDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @Min(0)
  montoInicial: number;
}
