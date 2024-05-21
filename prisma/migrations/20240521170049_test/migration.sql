-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_wechat_id" TEXT NOT NULL,
    "advance" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "production_cost" DOUBLE PRECISION NOT NULL,
    "photo" TEXT NOT NULL,
    "sold_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
