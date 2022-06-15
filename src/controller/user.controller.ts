import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserFormatter, UserService } from 'src/service/user';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { UserResponse } from 'src/interface/apiResponse';
import { Request } from 'src/shared/request';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService, private readonly userFormatter: UserFormatter) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
  public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
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
  public async currentUser(@Req() { user }: Request): Promise<UserResponse> {
    return this.userFormatter.toUserResponse(user);
  }
}
