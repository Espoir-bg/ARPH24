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

  it('crée une entreprise pour le propriétaire authentifié', async () => {
    prismaMock.company.create.mockResolvedValue({
      id: 'company-1',
      name: 'Entreprise de test',
      sector: 'Technologie',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.create('owner-1', {
      name: 'Entreprise de test',
      sector: 'Technologie',
    });

    expect(prismaMock.company.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ownerId: 'owner-1',
          name: 'Entreprise de test',
          sector: 'Technologie',
        }),
      }),
    );
  });

  it('filtre la liste par identifiant du propriétaire', async () => {
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
