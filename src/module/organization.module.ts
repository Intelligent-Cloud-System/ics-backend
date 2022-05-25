import { Module } from '@nestjs/common';

import { OrganizationService } from 'src/service/organization.service';
import { OrganizationController } from 'src/controller/organization.controller';
import { OrganizationRepository } from 'src/repository/organization.repository';
import { OrganizationFormatter } from 'src/formatter/organization.formatter';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository, OrganizationFormatter],
})
export class OrganizationModule {}
