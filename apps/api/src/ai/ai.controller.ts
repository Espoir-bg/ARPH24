import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('respond')
  async respond(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: { prompt?: unknown },
  ) {
    const expectedKey = process.env.ARP_INTERNAL_API_KEY;

    if (!expectedKey) {
      throw new ServiceUnavailableException(
        'Le service IA n’est pas encore configuré.',
      );
    }

    const suppliedKey = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    const supplied = Buffer.from(suppliedKey);
    const expected = Buffer.from(expectedKey);

    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      throw new ForbiddenException('Accès non autorisé.');
    }

    if (
      typeof body?.prompt !== 'string' ||
      !body.prompt.trim() ||
      body.prompt.length > 8000
    ) {
      throw new BadRequestException(
        'La demande doit contenir entre 1 et 8000 caractères.',
      );
    }

    return this.aiService.respond(body.prompt.trim());
  }
}
