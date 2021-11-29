import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { inject } from 'inversify';
import { UserFormatter } from 'src/formatter/user.formatter';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { UserResponse } from 'src/interface/apiResponse';
import { UserService } from 'src/service/user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    @inject(UserService) private readonly userService: UserService,
    @inject(UserFormatter) private readonly userFormatter: UserFormatter
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  @ApiBearerAuth('authorization')
  async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
    const user = await this.userService.registerUser(body);
    return this.userFormatter.toUserResponse(user);
  }
}
