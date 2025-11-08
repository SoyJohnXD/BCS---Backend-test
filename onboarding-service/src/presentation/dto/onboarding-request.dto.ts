import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OnboardingRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @Min(0)
  initialAmount: number;
}
