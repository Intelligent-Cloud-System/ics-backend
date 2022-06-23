import path from 'path';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  HeadObjectCommandOutput,
  ListObjectsCommandInput,
  ListObjectsCommandOutput,
  DeleteObjectCommandInput,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost, PresignedPostOptions } from '@aws-sdk/s3-presigned-post';

import { AWSConfig, S3Config } from 'src/config/interfaces';

export type PutObjectCommandInputBody = Readable | string | Uint8Array | Buffer;

export interface PostFileInfo {
  key: string;
  maxFileSize: number;
}

export interface SignedPostUrlResponse {
  [key: string]: PresignedPost;
}

export interface SignedUrlResponse {
  [key: string]: string;
}

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly s3Config: S3Config;

  constructor(private readonly configService: ConfigService) {
    const awsConfig: AWSConfig = this.configService.get<AWSConfig>('aws') as AWSConfig;

    this.client = new S3Client({
      region: awsConfig.s3.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });

    this.s3Config = awsConfig.s3;
  }

  public async checkFolderExists(Key: string, delimiter?: string): Promise<boolean> {
    const folders = await this.getFolderObjects(Key, delimiter);
    return folders.Contents !== undefined;
  }

  public async upload(Key: string, Body?: PutObjectCommandInputBody): Promise<void> {
    const input: PutObjectCommandInput = {
      Bucket: this.s3Config.bucket,
      Key,
      Body,
    };

    const command = new PutObjectCommand(input);
    await this.client.send(command);
  }

  public async getSignedGetUrl(key: string): Promise<string> {
    const input: GetObjectCommandInput = {
      Bucket: this.s3Config.bucket,
      Key: key,
    };

    const command = new GetObjectCommand(input);

    return await getSignedUrl(this.client, command, { expiresIn: this.s3Config.getUrlTtl });
  }

  public async getSignedGetUrls(filenames: Array<string>, folderPath: string): Promise<SignedUrlResponse> {
    const files: SignedUrlResponse = {};

    const promises = filenames.map(async (filename: string): Promise<void> => {
      const key = path.join(folderPath, filename);
      const url = await this.getSignedGetUrl(key);
      files[filename] = url;
    });

    await Promise.all(promises);

    return files;
  }

  public async getSignedPostUrl(key: string, maxFileSize: number): Promise<PresignedPost> {
    const options: PresignedPostOptions = {
      Bucket: this.s3Config.bucket,
      Key: key,
      Conditions: [['content-length-range', 0, maxFileSize]],
      Expires: this.s3Config.postUrlTtl,
    };

    return await createPresignedPost(this.client, options);
  }

  public async getSignedPostUrls(filesInfo: Array<PostFileInfo>): Promise<SignedPostUrlResponse> {
    const files: SignedPostUrlResponse = {};

    const promises = filesInfo.map(async (fileInfo: PostFileInfo): Promise<void> => {
      const url = await this.getSignedPostUrl(fileInfo.key, fileInfo.maxFileSize);
      files[fileInfo.key] = url;
    });

    await Promise.all(promises);

    return files;
  }

  public async getFolderObjects(folder: string, delimiter?: string): Promise<ListObjectsCommandOutput> {
    const input: ListObjectsCommandInput = {
      Bucket: this.s3Config.bucket,
      Delimiter: delimiter,
      EncodingType: 'url',
      Prefix: folder,
    };
    const command = new ListObjectsCommand(input);

    const response: ListObjectsCommandOutput = await this.client.send(command);

    return response;
  }

  public async deleteFile(key: string): Promise<void> {
    const input: DeleteObjectCommandInput = {
      Bucket: this.s3Config.bucket,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);

    await this.client.send(command);
  }

  public async deleteFolder(folder: string): Promise<void> {
    const objects = await this.getFolderObjects(folder);
    const Objects: ObjectIdentifier[] =
      (objects.Contents || []).filter((file) => !!file.Key).map((file) => ({ Key: file.Key })) || [];

    const input: DeleteObjectsCommandInput = {
      Bucket: this.s3Config.bucket,
      Delete: { Objects },
    };

    const command = new DeleteObjectsCommand(input);

    await this.client.send(command);
  }

  // in bytes
  public async getFileLength(key: string): Promise<number> {
    const input = {
      Bucket: this.s3Config.bucket,
      Key: key,
    };

    const command = new HeadObjectCommand(input);

    const response: HeadObjectCommandOutput = await this.client.send(command);

    return response.ContentLength as number;
  }
}
