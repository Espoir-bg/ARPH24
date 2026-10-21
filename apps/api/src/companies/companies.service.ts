import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const TRIAL_DURATION_DAYS = 30;

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    ownerId: string,
    input: { name?: unknown; sector?: unknown },
  ) {
    if (typeof input.name !== 'string') {
      throw new BadRequestException(
        'Le nom de l’entreprise est requis.',
      );
    }

    const name = input.name.trim();

    if (name.length < 2 || name.length > 150) {
      throw new BadRequestException(
        'Le nom doit contenir entre 2 et 150 caractères.',
      );
    }

    let sector: string | undefined;

    if (input.sector !== undefined && input.sector !== null) {
      if (
        typeof input.sector !== 'string' ||
        input.sector.trim().length > 100
      ) {
        throw new BadRequestException(
          'Secteur d’activité invalide.',
        );
      }

      sector = input.sector.trim() || undefined;
    }

    const trialStartedAt = new Date();
    const trialEndsAt = new Date(trialStartedAt);
    trialEndsAt.setDate(
      trialEndsAt.getDate() + TRIAL_DURATION_DAYS,
    );

    return this.prisma.company.create({
      data: {
        name,
        sector,
        ownerId,
        trialStartedAt,
        trialEndsAt,
        subscriptionStatus: 'TRIALING',
      },
      select: {
        id: true,
        name: true,
        sector: true,
        trialStartedAt: true,
        trialEndsAt: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });
  }

  async findMine(ownerId: string) {
    return this.prisma.company.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        sector: true,
        trialStartedAt: true,
        trialEndsAt: true,
        subscriptionStatus: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
