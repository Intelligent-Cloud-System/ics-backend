import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrganizationFormatter } from 'src/formatter/organization.formatter';
import { RegisterOrganizationRequest } from 'src/interface/apiRequest';
import { OrganizationResponse } from 'src/interface/apiResponse';
import { OrganizationService } from 'src/service/organization.service';

@Controller('organizations')
@ApiTags('Organization')
export class OrganizationController {
  constructor(
    private readonly userService: OrganizationService,
    private readonly userFormatter: OrganizationFormatter
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: OrganizationResponse })
  public async register(@Body() body: RegisterOrganizationRequest): Promise<OrganizationResponse> {
    const organization = await this.userService.registerOrganization(body);
    return this.userFormatter.toOrganizationResponse(organization);
  }
}
