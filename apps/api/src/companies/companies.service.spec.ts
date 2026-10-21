import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const prismaMock = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new CompaniesService(
      prismaMock as unknown as PrismaService,
    );
  });

  it('crée une entreprise avec un essai de 30 jours', async () => {
    prismaMock.company.create.mockImplementation(
      async ({ data }: { data: Record<string, unknown> }) => ({
        id: 'company-1',
        ...data,
        createdAt: new Date(),
      }),
    );

    const before = Date.now();

    await service.create('owner-1', {
      name: 'Entreprise de test',
      sector: 'Technologie',
    });

    const after = Date.now();

    const call = prismaMock.company.create.mock.calls[0][0];
    const data = call.data as {
      ownerId: string;
      trialStartedAt: Date;
      trialEndsAt: Date;
      subscriptionStatus: string;
    };

    expect(data.ownerId).toBe('owner-1');
    expect(data.subscriptionStatus).toBe('TRIALING');

    expect(data.trialStartedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(data.trialStartedAt.getTime()).toBeLessThanOrEqual(after);

    const duration =
      data.trialEndsAt.getTime() - data.trialStartedAt.getTime();

    expect(duration).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it('filtre les entreprises par propriétaire', async () => {
    prismaMock.company.findMany.mockResolvedValue([]);

    await service.findMine('owner-42');

    expect(prismaMock.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ownerId: 'owner-42' },
      }),
    );
  });

  it('refuse un nom d’entreprise trop court', async () => {
    await expect(
      service.create('owner-1', { name: ' ' }),
    ).rejects.toThrow(
      'Le nom doit contenir entre 2 et 150 caractères.',
    );

    expect(prismaMock.company.create).not.toHaveBeenCalled();
  });
});
