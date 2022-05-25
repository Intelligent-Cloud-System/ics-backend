import {MigrationInterface, QueryRunner} from "typeorm";

export class organizations1653485130905 implements MigrationInterface {
    name = 'organizations1653485130905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
