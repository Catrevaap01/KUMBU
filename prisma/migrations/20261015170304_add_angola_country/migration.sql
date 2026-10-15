-- AlterEnum
ALTER TYPE "Country" ADD VALUE 'ANGOLA';

-- AlterTable
ALTER TABLE "PriceReport" ALTER COLUMN "currency" SET DEFAULT 'AOA';

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "city" SET DEFAULT 'Luanda',
ALTER COLUMN "country" SET DEFAULT 'ANGOLA';
