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

export class UploadSingleFileInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;
}

export class ReceiveUrlPostRequest {
  @ApiProperty()
  location: string;

  @ApiProperty({ isArray: true, type: UploadSingleFileInfo })
  fileInfos: Array<{ name: string; size: number }>;
}

export class ReceiveUrlGetRequest {
  @ApiProperty()
  location: string;

  @ApiProperty({ isArray: true, type: String })
  names: Array<string>;
}

export class FileManagerDeleteRequest {
  @ApiProperty({ isArray: true, type: String })
  paths: Array<string>;
}
