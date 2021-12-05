import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { FileEntity } from '../entity/file.entity';
import { File } from '../model';
import { Result } from '../shared/util/util';

@Injectable()
export class FileRepository {
  constructor(private manager: EntityManager) {}

  public async getById(id: number): Promise<Result<File>> {
    const fileEntity = await this.manager
      .getRepository(FileEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();

    if (fileEntity) {
      return this.convertToModel(fileEntity);
    }
  }

  public async getByPath(path: string): Promise<Result<File>> {
    const fileEntity = await this.manager
      .getRepository(FileEntity)
      .createQueryBuilder()
      .where('file_path = :path', { path })
      .getOne();

    if (fileEntity) {
      return this.convertToModel(fileEntity);
    }
  }

  public async getAllUserFiles(userId: number): Promise<Result<File>[]> {
    const filesEntity = await this.manager
      .getRepository(FileEntity)
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .getMany();

    if (filesEntity && filesEntity.length) {
      return filesEntity.map(this.convertToModel);
    }

    return [];
  }

  public async insertFile(file: File): Promise<File> {
    const { raw } = await this.manager
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values({
        filePath: file.filePath,
        fileSize: file.fileSize,
        userId: file.userId,
      })
      .execute();

    return (await this.getById(raw[0].id)) as File;
  }

  public async updateFile(file: File): Promise<File> {
    const { raw } = await this.manager
      .createQueryBuilder()
      .update(FileEntity)
      .set({
        fileSize: file.fileSize,
      })
      .where('file_path = :path and user_id = :userId', {
        path: file.filePath,
        userId: file.userId,
      })
      .execute();

    return (await this.getByPath(file.filePath)) as File;
  }

  public async deleteFileById(id: number): Promise<void> {
    if (await this.getById(id)) {
      const { raw } = await this.manager
        .createQueryBuilder()
        .delete()
        .from(FileEntity)
        .where('id = :id', { id })
        .execute();

      if (await this.getById(raw[0].id))
        return Promise.reject('Error when deleting an existing file');
    }
  }

  private convertToModel(fileEntity?: FileEntity): Result<File> {
    if (fileEntity) {
      return new File(
        fileEntity.filePath,
        fileEntity.fileSize,
        fileEntity.userId
      );
    }
  }
}
