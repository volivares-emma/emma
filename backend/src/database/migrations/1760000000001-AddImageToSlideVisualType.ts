import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToSlideVisualType1760000000001
  implements MigrationInterface
{
  name = 'AddImageToSlideVisualType1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "tbl_slides_visual_type_enum" ADD VALUE IF NOT EXISTS 'image'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "tbl_slides_visual_type_enum_old" AS ENUM('dashboard', 'analytics', 'team', 'growth', 'innovation')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_slides" ALTER COLUMN "visual_type" TYPE "tbl_slides_visual_type_enum_old" USING "visual_type"::text::"tbl_slides_visual_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "tbl_slides_visual_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "tbl_slides_visual_type_enum_old" RENAME TO "tbl_slides_visual_type_enum"`,
    );
  }
}
