import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Result } from 'src/shared/util/util';
import { Organization } from 'src/model/organization';
import { OrganizationEntity } from 'src/entity/organization.entity';

@Injectable()
export class OrganizationRepository {
  constructor(private manager: EntityManager) {}

  public async getById(id: number): Promise<Result<Organization>> {
    const userEntity = await this.manager
      .getRepository(OrganizationEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();

    return this.convertToModel(userEntity);
  }

  public async insertOrganization(organization: Organization): Promise<Organization> {
    const { raw } = await this.manager
      .createQueryBuilder()
      .insert()
      .into(OrganizationEntity)
      .values({
        name: organization.name,
      })
      .execute();

    return (await this.getById(raw[0].id)) as Organization;
  }

  public async getByName(name: string): Promise<Result<Organization>> {
    const organizationEntity = await this.manager
      .getRepository(OrganizationEntity)
      .createQueryBuilder()
      .where('name = :name', { name })
      .getOne();

    if (organizationEntity) {
      return this.convertToModel(organizationEntity);
    }
  }

  public convertToModel(orgEntity?: OrganizationEntity): Result<Organization> {
    if (orgEntity) {
      return new Organization(orgEntity.name, orgEntity.id);
    }
  }
}
