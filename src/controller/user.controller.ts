import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserFormatter } from 'src/formatter/user.formatter';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { UserResponse } from 'src/interface/apiResponse';
import { UserService } from 'src/service/user.service';
import { Request } from 'src/shared/request';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userFormatter: UserFormatter
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  public async register(
    @Body() body: RegisterUserRequest
  ): Promise<UserResponse> {
    const user = await this.userService.registerUser(body);
    return this.userFormatter.toUserResponse(user);
  }

  /**
   * This is probably the solution we will need in the future 
   * when migrating to web sockets
   */
  @Get('current')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  public async currentUser(@Req() req: Request): Promise<UserResponse> {
    const userResponse = await this.userService.getUserByEmail(req.user.email);
    return userResponse as UserResponse;
  }
}
