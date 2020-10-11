import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1602445451363 implements MigrationInterface {
    name = 'initial1602445451363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "token_permission_enum" AS ENUM('Feedback', 'Edit')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "permission" "token_permission_enum" NOT NULL, "diagramId" integer, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "diagram" ("id" SERIAL NOT NULL, "diagram" text NOT NULL, CONSTRAINT "PK_3c2b8675a863e1df4849c16a9b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_0fc62334ffe56b7dd1bae69b91e" FOREIGN KEY ("diagramId") REFERENCES "diagram"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_0fc62334ffe56b7dd1bae69b91e"`);
        await queryRunner.query(`DROP TABLE "diagram"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "token_permission_enum"`);
    }

}
