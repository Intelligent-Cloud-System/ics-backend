import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserFormatter } from 'src/formatter/user.formatter';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { UserResponse } from 'src/interface/apiResponse';
import { UserService } from 'src/service/user.service';

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
}
