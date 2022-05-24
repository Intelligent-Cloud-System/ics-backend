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
}

export class ListResponse {
  @ApiProperty({ type: FolderResponse, isArray: true })
  folders: Array<FolderResponse>;

  @ApiProperty({ type: FileResponse, isArray: true })
  files: Array<FileResponse>;
}

export class LinkInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;
}

export class LinksResponse {
  @ApiProperty({ isArray: true, type: LinkInfo })
  links: Array<{ name: string; url: string }>;
}
