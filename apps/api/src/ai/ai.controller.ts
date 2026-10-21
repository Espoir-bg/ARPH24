import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('respond')
  async respond(
    @Body() body: { prompt?: unknown },
  ) {
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
