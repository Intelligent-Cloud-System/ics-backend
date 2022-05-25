import {MigrationInterface, QueryRunner} from "typeorm";

export class organizations1653476885373 implements MigrationInterface {
    name = 'organizations1653476885373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
