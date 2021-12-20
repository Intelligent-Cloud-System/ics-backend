import {MigrationInterface, QueryRunner} from "typeorm";

export class userCreatedAt1639958632105 implements MigrationInterface {
    name = 'userCreatedAt1639958632105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "cteatedAt" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "cteatedAt"`);
    }

}
