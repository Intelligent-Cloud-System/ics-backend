import { ApiProperty } from "@nestjs/swagger";

export class SimpleResponse {
  @ApiProperty()
  a: number;
}