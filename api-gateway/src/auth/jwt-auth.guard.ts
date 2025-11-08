import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

type AuthenticatedRequest = Request & { user: JwtPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determina si la solicitud actual está autorizada.
   * Valida el token JWT presente en la cabecera de autorización.
   *
   * @param context El contexto de ejecución de la solicitud.
   * @returns Un booleano que indica si la solicitud puede proceder.
   * @throws {UnauthorizedException} Si el token falta o no es válido.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  /**
   * Extrae el token JWT de la cabecera 'Authorization' (tipo Bearer).
   *
   * @param request La solicitud HTTP entrante.
   * @returns El token como string, o undefined si no se encuentra.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
