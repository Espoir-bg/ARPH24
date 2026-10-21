import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(
    private readonly companies: CompaniesService,
  ) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() body: { name?: unknown; sector?: unknown },
  ) {
    return this.companies.create(request.user.sub, body);
  }

  @Get()
  findMine(@Req() request: AuthenticatedRequest) {
    return this.companies.findMine(request.user.sub);
  }
}
