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

export interface S3Config {
  bucket: string;
  linkTtl: number;
}

export interface AWSConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  userPoolId: string;
  s3: S3Config;
}

export interface FileConfig {
  secretKey: Array<number>;
  algorithm: string;
  separator: string;
  storageFolder: string;
}
