import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    AiModule,
  ],
})
export class AppModule {}
