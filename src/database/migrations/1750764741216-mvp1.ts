import { MigrationInterface, QueryRunner } from "typeorm";

export class Mvp11750764741216 implements MigrationInterface {
  name = "Mvp11750764741216";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth"."social" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying(255) NOT NULL, "social_code" smallint NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_587dc74adeb23357c4983c6374" UNIQUE ("user_id"), CONSTRAINT "pk_idx_social_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_auth_social_user_id" ON "auth"."social" ("user_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_social_external_id_social_code" ON "auth"."social" ("external_id", "social_code") `
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying(255) NOT NULL, "session_id" uuid NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE ("token"), CONSTRAINT "UQ_7643a722ca45fb721be1c63dc0c" UNIQUE ("session_id"), CONSTRAINT "pk_idx_refresh_token_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_auth_refresh_token_user_id" ON "auth"."refresh_token" ("user_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(20) NOT NULL, "context" character varying(100) NOT NULL, "top" bigint NOT NULL, "left" bigint NOT NULL, "folder_id" uuid NOT NULL, "user_id" uuid NOT NULL, "finish_date" TIMESTAMP WITH TIME ZONE, "folded_state" boolean NOT NULL DEFAULT false, CONSTRAINT "pk_idx_user_card_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_card_user_id" ON "card" ("user_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(10) NOT NULL, "email" character varying(255) NOT NULL, "email_active" boolean NOT NULL DEFAULT true, "profile" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "pk_idx_user_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "folder" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "width_name" character varying(10) NOT NULL, "height_name" character varying(10) NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "pk_idx_user_folder_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_folder_user_id" ON "folder" ("user_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."social" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."refresh_token" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_00ec72ad98922117bad8a86f980" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_9b8eabefc1fdd72925eab13f9f0" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "folder" ADD CONSTRAINT "FK_b5eabd10f2fe9607e6f5a6ec6bc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "folder" DROP CONSTRAINT "FK_b5eabd10f2fe9607e6f5a6ec6bc"`
    );
    await queryRunner.query(
      `ALTER TABLE "card" DROP CONSTRAINT "FK_9b8eabefc1fdd72925eab13f9f0"`
    );
    await queryRunner.query(
      `ALTER TABLE "card" DROP CONSTRAINT "FK_00ec72ad98922117bad8a86f980"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."refresh_token" DROP CONSTRAINT "fk_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."social" DROP CONSTRAINT "fk_user_id"`
    );
    await queryRunner.query(`DROP INDEX "public"."idx_folder_user_id"`);
    await queryRunner.query(`DROP TABLE "folder"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."idx_card_user_id"`);
    await queryRunner.query(`DROP TABLE "card"`);
    await queryRunner.query(
      `DROP INDEX "auth"."idx_auth_refresh_token_user_id"`
    );
    await queryRunner.query(`DROP TABLE "auth"."refresh_token"`);
    await queryRunner.query(
      `DROP INDEX "auth"."idx_social_external_id_social_code"`
    );
    await queryRunner.query(`DROP INDEX "auth"."idx_auth_social_user_id"`);
    await queryRunner.query(`DROP TABLE "auth"."social"`);
  }
}
