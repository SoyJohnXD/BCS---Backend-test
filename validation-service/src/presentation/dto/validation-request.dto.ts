import { IsNotEmpty, IsUUID } from 'class-validator';

export class ValidationRequestDto {
  @IsUUID(4)
  @IsNotEmpty()
  onboardingId: string;
}
