import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OrganizationRepository } from 'src/repository/organization.repository';
import { AWSConfig } from 'src/config/interfaces';
import { ApplicationError } from 'src/shared/error/applicationError';
import { Organization } from 'src/model/organization';
import { Result } from 'src/shared/util/util';
import { RegisterOrganizationRequest } from 'src/interface/apiRequest';

@Injectable()
export class OrganizationService {
  private readonly awsConfig: AWSConfig;

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly configService: ConfigService
  ) {
    const awsConfig: AWSConfig = this.configService.get<AWSConfig>('aws') as AWSConfig;
    this.awsConfig = awsConfig;
  }

  public async registerOrganization(body: RegisterOrganizationRequest): Promise<Organization> {
    const organization = new Organization(body.name);

    const insertedOrganization = await this.upsertOrganization(organization);

    return insertedOrganization;
  }

  public async getOrganizationByName(name: string): Promise<Result<Organization>> {
    return await this.organizationRepository.getByName(name);
  }

  public async upsertOrganization(organization: Organization): Promise<Organization> {
    const existingOrganization = await this.getOrganizationByName(organization.name);
    if (existingOrganization) {
      return existingOrganization;
    }

    return await this.organizationRepository.insertOrganization(organization);
  }
}

export class NotValidTokenError extends ApplicationError {}
export class UserDoesNotExistsError extends ApplicationError {}
