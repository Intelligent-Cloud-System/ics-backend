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

export class FolderResponse {
  @ApiProperty()
  path: string;
}

export class FileResponse {
  @ApiProperty()
  size: number;

  @ApiProperty()
  lastModifiedAt: Date;

  @ApiProperty()
  basename: string;

  @ApiProperty()
  path: string;
}

export class FileManagerListResponse {
  @ApiProperty({ type: FolderResponse, isArray: true })
  folders: Array<FolderResponse>;

  @ApiProperty({ type: FileResponse, isArray: true })
  files: Array<FileResponse>;
}

export class PostUrlInfo {
  @ApiProperty()
  path: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  url: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [{ type: 'string' }],
    },
  })
  fields: {
    [key: string]: string;
  };
}

export class SignedPostUrlsResponse {
  @ApiProperty({ isArray: true, type: PostUrlInfo })
  urls: Array<PostUrlInfo>;
}
