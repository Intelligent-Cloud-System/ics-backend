import {MigrationInterface, QueryRunner} from "typeorm";

export class fileKeyImplementation1645352749481 implements MigrationInterface {
    name = 'fileKeyImplementation1645352749481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_308145025df542598d39c77e466"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "file_path"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "file_size"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_e4a453ce0a609a5f94c66afb6ca" UNIQUE ("key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_e4a453ce0a609a5f94c66afb6ca"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "file_size" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "file_path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_308145025df542598d39c77e466" UNIQUE ("file_path", "user_id")`);
    }

}
