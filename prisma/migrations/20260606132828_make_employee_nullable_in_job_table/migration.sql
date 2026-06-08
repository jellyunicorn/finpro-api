-- DropForeignKey
ALTER TABLE "order_jobs" DROP CONSTRAINT "order_jobs_employee_id_fkey";

-- AlterTable
ALTER TABLE "order_jobs" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order_jobs" ADD CONSTRAINT "order_jobs_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
