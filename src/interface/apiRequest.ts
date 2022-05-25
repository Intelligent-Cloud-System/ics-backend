import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
}

export class RegisterOrganizationRequest {
  @ApiProperty()
  name: string;
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

export class UploadSingleFileInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;
}

export class UploadFileRequest {
  @ApiProperty()
  location: string;

  @ApiProperty({ isArray: true, type: UploadSingleFileInfo })
  fileInfos: Array<{ name: string; size: number }>;
}

export class DeleteFileRequest {
  @ApiProperty()
  location: string;
}
