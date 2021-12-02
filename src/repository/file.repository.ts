import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { FileEntity } from '../entity/file.entity';
import { File, User } from '../model';
import { Result } from '../util/util';

@Injectable()
export class FileRepository {
  constructor(private manager: EntityManager) {}

  public async getById(id: number): Promise<Result<File>> {
    const fileEntity = await this.manager
      .getRepository(FileEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne()


    console.log(fileEntity);
    if (fileEntity) {
      return this.convertToModel(fileEntity);
    }
  }

  public async insertFile(file: File): Promise<File> {
    const { raw } = await this.manager
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values({
        filePath: file.filePath,
        fileSize: file.fileSize,
        userId: file.userId
      })
      .execute()

    return (await this.getById(raw[0].id)) as File;
  }


  private convertToModel(fileEntity?: FileEntity): Result<File> {
    if (fileEntity) {
      return new File(
        fileEntity.filePath,
        fileEntity.fileSize,
        fileEntity.userId
      )
    }
  }
}