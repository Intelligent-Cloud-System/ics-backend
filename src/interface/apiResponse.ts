import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/entity/user.entity';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: UserRole;
}

export class FileResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;
}

export class FileDeleteResponse {
  @ApiProperty()
  id: number;
}
