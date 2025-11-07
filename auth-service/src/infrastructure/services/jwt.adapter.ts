import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@/application/ports/token.port';

@Injectable()
export class JwtAdapter implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: { sub: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
