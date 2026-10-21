import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: {
    email?: unknown;
    password?: unknown;
    fullName?: unknown;
  }) {
    if (
      typeof input.email !== 'string' ||
      typeof input.password !== 'string' ||
      typeof input.fullName !== 'string'
    ) {
      throw new ConflictException(
        'Le nom complet, l’adresse e-mail et le mot de passe sont requis.',
      );
    }

    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();
    const password = input.password;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    ) {
      throw new ConflictException('Adresse e-mail invalide.');
    }

    if (fullName.length < 2 || fullName.length > 100) {
      throw new ConflictException(
        'Le nom doit contenir entre 2 et 100 caractères.',
      );
    }

    if (password.length < 12 || password.length > 72) {
      throw new ConflictException(
        'Le mot de passe doit contenir entre 12 et 72 caractères.',
      );
    }

    const existing = await this.prisma.owner.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        'Un compte existe déjà avec cette adresse e-mail.',
      );
    }

    const passwordHash = await hash(password, 12);

    const owner = await this.prisma.owner.create({
      data: { email, fullName, passwordHash },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    const accessToken = await this.jwt.signAsync({
      sub: owner.id,
      email: owner.email,
    });

    return { owner, accessToken, tokenType: 'Bearer' };
  }

  async login(input: { email?: unknown; password?: unknown }) {
    if (
      typeof input.email !== 'string' ||
      typeof input.password !== 'string' ||
      input.email.length > 254 ||
      input.password.length > 72
    ) {
      throw new UnauthorizedException(
        'Adresse e-mail ou mot de passe incorrect.',
      );
    }

    const email = input.email.trim().toLowerCase();

    const owner = await this.prisma.owner.findUnique({
      where: { email },
    });

    if (!owner || !(await compare(input.password, owner.passwordHash))) {
      throw new UnauthorizedException(
        'Adresse e-mail ou mot de passe incorrect.',
      );
    }

    const accessToken = await this.jwt.signAsync({
      sub: owner.id,
      email: owner.email,
    });

    return {
      owner: {
        id: owner.id,
        email: owner.email,
        fullName: owner.fullName,
        createdAt: owner.createdAt,
      },
      accessToken,
      tokenType: 'Bearer',
    };
  }

  async getProfile(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    if (!owner) {
      throw new UnauthorizedException('Compte introuvable.');
    }

    return owner;
  }
}
