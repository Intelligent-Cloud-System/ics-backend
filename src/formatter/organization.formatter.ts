import { Injectable } from '@nestjs/common';

import { OrganizationResponse } from 'src/interface/apiResponse';
import { Organization } from 'src/model/organization';

@Injectable()
export class OrganizationFormatter {
  toOrganizationResponse(organization: Organization): OrganizationResponse {
    return { id: organization.id, name: organization.name };
  }
}
