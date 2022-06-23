import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserFormatter, UserService } from 'src/service/user';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { UserIconResponse as UserIconResponse, UserResponse } from 'src/interface/apiResponse';
import { Request } from 'src/shared/request';
import { StorageService } from 'src/service/storage';
import { ImageGen } from 'src/service/icon';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userFormatter: UserFormatter,
    private readonly storageService: StorageService,
    private readonly imageGen: ImageGen
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
  public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
    const user = await this.userService.registerUser(body);

    const icon = await this.imageGen.generateImage(user.email);
    this.storageService.upload(`userIcons/${user.id}/icon.jpg`, icon);

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

  @Get('icon')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: UserIconResponse })
  public async getUserIcon(@Query('userId') userId: number): Promise<UserIconResponse > {
    const url = await this.storageService.getSignedGetUrl(`userIcons/${userId}/icon.jpg`);
    return this.userFormatter.toUserIconResponse(url);
  }
}
