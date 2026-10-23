import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(
    @Body()
    body?: {
      email?: unknown;
      password?: unknown;
      fullName?: unknown;
    },
  ) {
    return this.auth.register(body ?? {});
  }

  @Post('login')
  login(
    @Body()
    body?: {
      email?: unknown;
      password?: unknown;
    },
  ) {
    return this.auth.login(body ?? {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return this.auth.getProfile(request.user.sub);
  }
}
