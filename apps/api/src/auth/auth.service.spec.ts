import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    owner: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtMock = {
    signAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prismaMock as unknown as PrismaService,
      jwtMock as unknown as JwtService,
    );
  });

  it('refuse une adresse e-mail invalide', async () => {
    await expect(
      service.register({
        email: 'pas-une-adresse',
        password: 'MotDePasseLong123!',
        fullName: 'Propriétaire Test',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prismaMock.owner.create).not.toHaveBeenCalled();
  });

  it('refuse un mot de passe trop court', async () => {
    await expect(
      service.register({
        email: 'owner@example.com',
        password: 'court',
        fullName: 'Propriétaire Test',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prismaMock.owner.create).not.toHaveBeenCalled();
  });

  it('refuse une adresse e-mail déjà utilisée', async () => {
    prismaMock.owner.findUnique.mockResolvedValue({ id: 'owner-existing' });

    await expect(
      service.register({
        email: 'owner@example.com',
        password: 'MotDePasseLong123!',
        fullName: 'Propriétaire Test',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prismaMock.owner.create).not.toHaveBeenCalled();
  });

  it('refuse une connexion avec des identifiants invalides', async () => {
    prismaMock.owner.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'absent@example.com',
        password: 'MotDePasseLong123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtMock.signAsync).not.toHaveBeenCalled();
  });

  it('normalise l’adresse e-mail lors de la recherche', async () => {
    prismaMock.owner.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: ' OWNER@EXAMPLE.COM ',
        password: 'MotDePasseLong123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(prismaMock.owner.findUnique).toHaveBeenCalledWith({
      where: { email: 'owner@example.com' },
    });
  });
});
