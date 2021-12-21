import {MigrationInterface, QueryRunner} from "typeorm";

export class fileCreatedAt1639926876602 implements MigrationInterface {
    name = 'fileCreatedAt1639926876602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "cteatedAt" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "created_at" TO "cteatedAt"`);
    }

}
