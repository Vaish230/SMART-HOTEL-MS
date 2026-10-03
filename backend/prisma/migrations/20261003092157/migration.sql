/*
  Warnings:

  - The values [FRONTDESK] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordhash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN', 'SUPERVISOR', 'MANAGER', 'CHEF', 'WAITER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passwordhash" TEXT NOT NULL;
