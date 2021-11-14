import { Module } from '@nestjs/common';
import { SystemController } from 'src/controller/system.controller';

@Module({
  imports: [],
  controllers: [SystemController],
  providers: [],
})
export class SystemModule {}
