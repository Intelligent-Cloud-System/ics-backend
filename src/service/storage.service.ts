import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  _Object,
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandInput,
  ListObjectsCommandOutput,
  DeleteObjectCommandInput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost, PresignedPostOptions } from '@aws-sdk/s3-presigned-post';

import { AWSConfig } from '../config/interfaces';

export interface SignedGetUrlsResponse {
  [key: string]: string;
}

export interface SignedPostUrlsResponse {
  [key: string]: PresignedPost;
}

export interface FileInfo {
  key: string;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const awsConfig: AWSConfig = this.configService.get('aws') as AWSConfig;
    this.client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  public async getSignedGetUrl(
    key: string,
    expiresIn: number = this.configService.get('aws.s3.linkTtl') as number
  ): Promise<string> {
    const input: GetObjectCommandInput = {
      Bucket: this.configService.get('aws.s3.bucket'),
      Key: key,
    };

    const command = new GetObjectCommand(input);

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  public async getSignedGetUrls(
    keys: Array<string>,
    expiresIn: number = this.configService.get('aws.s3.linkTtl') as number
  ): Promise<Record<string, string>> {
    const urlsResponse: SignedGetUrlsResponse = {};

    const promises = keys.map(async (key: string): Promise<void> => {
      const url = await this.getSignedGetUrl(key, expiresIn);
      urlsResponse[key] = url;
    });

    await Promise.all(promises);

    return urlsResponse;
  }

  public async getSignedPostUrl(
    file: FileInfo,
    expiresIn: number = this.configService.get('aws.s3.linkTtl') as number
  ): Promise<PresignedPost> {
    const options: PresignedPostOptions = {
      Bucket: this.configService.get('aws.s3.bucket') as string,
      Key: file.key,
      Conditions: [['content-length-range', 0, file.size]],
      Expires: expiresIn,
    };

    return await createPresignedPost(this.client, options);
  }

  public async getSignedPostUrls(
    files: Array<FileInfo>,
    expiresIn: number = this.configService.get('aws.s3.linkTtl') as number
  ): Promise<SignedPostUrlsResponse> {
    const urlsResponse: SignedPostUrlsResponse = {};

    const promises = files.map(async (file: FileInfo): Promise<void> => {
      const url = await this.getSignedPostUrl(file, expiresIn);
      urlsResponse[file.key] = url;
    });

    await Promise.all(promises);

    return urlsResponse;
  }

  public async getFolderFiles(folder: string): Promise<_Object[] | undefined> {
    const input: ListObjectsCommandInput = {
      Bucket: this.configService.get('aws.s3.bucket') as string,
      Prefix: folder,
    };
    const command = new ListObjectsCommand(input);

    const response: ListObjectsCommandOutput = await this.client.send(command);

    return response.Contents;
  }

  public async deleteFile(key: string): Promise<void> {
    const input: DeleteObjectCommandInput = {
      Bucket: this.configService.get('aws.s3.bucket') as string,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);

    await this.client.send(command);
  }
}
