import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (!token) {
      throw new UnauthorizedException('Authentification requise.');
    }

    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      if (
        typeof payload.sub !== 'string' ||
        typeof payload.email !== 'string'
      ) {
        throw new Error('Invalid token payload');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException(
        'Jeton absent, invalide ou expiré.',
      );
    }
  }
}
