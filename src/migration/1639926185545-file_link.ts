import {MigrationInterface, QueryRunner} from "typeorm";

export class fileLink1639926185545 implements MigrationInterface {
    name = 'fileLink1639926185545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "cteatedAt" TO "created_at"`);
        await queryRunner.query(`CREATE TABLE "file_link" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "expires_at" date, "file_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_acb487ec7ce25210fa96dfd095e" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_da35233ec2bfaa121bb3540039b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_da35233ec2bfaa121bb3540039b"`);
        await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_acb487ec7ce25210fa96dfd095e"`);
        await queryRunner.query(`DROP TABLE "file_link"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "cteatedAt"`);
    }

}
