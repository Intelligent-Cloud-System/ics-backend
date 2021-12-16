export interface DatabaseConfig {
  port: number;
  host: string;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: Array<string>;
}

export interface SwaggerConfig {
  title: string;
  description: string;
}

export interface AWSConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  userPoolId: string;
}
