import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
}

export class CreateFolderRequest {
  @ApiProperty({ type: String })
  location: string;

  @ApiProperty({ type: String })
  name: string;
}
