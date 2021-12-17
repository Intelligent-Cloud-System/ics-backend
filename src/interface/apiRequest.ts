import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
}

export class DeleteFileRequest {
  @ApiProperty({ isArray: true, type: Number })
  ids: Array<number>;
}
