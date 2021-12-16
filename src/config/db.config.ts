import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '', 10) || 5432,
  database: process.env.DATABASE_NAME,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  synchronize: false,
  entities: ['dist/entity/**/*.{ts,js}'],
}));
