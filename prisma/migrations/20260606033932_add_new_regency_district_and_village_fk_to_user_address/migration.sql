-- AlterTable
ALTER TABLE "user_addresses" ADD COLUMN     "district_code" TEXT,
ADD COLUMN     "regency_code" TEXT,
ADD COLUMN     "village_code" TEXT;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "regencies"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_village_code_fkey" FOREIGN KEY ("village_code") REFERENCES "villages"("code") ON DELETE SET NULL ON UPDATE CASCADE;
