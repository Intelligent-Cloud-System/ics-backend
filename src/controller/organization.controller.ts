import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrganizationFormatter } from 'src/formatter/organization.formatter';
import { RegisterOrganizationRequest } from 'src/interface/apiRequest';
import { OrganizationResponse } from 'src/interface/apiResponse';
import { OrganizationService } from 'src/service/organization.service';
import { Request } from '../shared/request';

@Controller('organizations')
@ApiTags('Organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationFormatter: OrganizationFormatter
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: OrganizationResponse })
  public async register(@Req() {}: Request, @Body() body: RegisterOrganizationRequest): Promise<OrganizationResponse> {
    const organization = await this.organizationService.registerOrganization(body);
    return this.organizationFormatter.toOrganizationResponse(organization);
  }
}
