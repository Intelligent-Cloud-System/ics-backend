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
  @ApiProperty()
  location: string;

  @ApiProperty()
  name: string;
}

export class DeleteFolderRequest {
  @ApiProperty()
  path: string;
}

export class UploadFileRequest {
  @ApiProperty()
  location: string;

  @ApiProperty()
  fileInfos: Array<{ name: string; size: number }>;
}

export class DeleteFileRequest {
  @ApiProperty()
  location: string;
}
