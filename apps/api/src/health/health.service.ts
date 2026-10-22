import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getStatus() {
    return {
      status: 'ok',
      service: 'arph24-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }

  async getDatabaseStatus() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'connected',
        service: 'arph24-database',
        database: 'postgresql',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'unavailable',
        service: 'arph24-database',
        message: 'La base de données est temporairement inaccessible.',
      });
    }
  }
}
