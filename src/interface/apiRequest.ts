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

export class DeleteFolderRequest {
  @ApiProperty({ type: String })
  path: string;
}

export class UploadFileRequest {
  @ApiProperty({ type: String })
  location: string;

  @ApiProperty({ type: Array, isArray: true })
  fileInfos: Array<{ name: string; size: number }>;
}

export class DeleteFileRequest {
  @ApiProperty({ type: String })
  location: string;
}
