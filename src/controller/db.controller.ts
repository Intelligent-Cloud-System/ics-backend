import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/interfaces';

@Controller('db')
export class DbController {
  constructor(private readonly configServise: ConfigService) {}

  @Get()
  getConfigInfo(): DatabaseConfig {
    const database = this.configServise.get<DatabaseConfig>('database')
    return database;
  }
}
