/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('success', 'failed', 'pending');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'file');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('appointment_reminder', 'payment_success', 'system_alert', 'order_update', 'new_message');

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('android', 'ios', 'web');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('open', 'investigating', 'resolved', 'rejected');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('monthly', 'quarterly', 'yearly');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('pdpa', 'medical_disclaimer', 'marketing');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'food_partner';

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_nutritionist_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patient_id_fkey";

-- AlterTable
ALTER TABLE "patient_allergies" ADD COLUMN     "ingredient_id" INTEGER;

-- DropTable
DROP TABLE "Appointment";

-- CreateTable
CREATE TABLE "appointment" (
    "appointment_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "type" "AppointmentType" NOT NULL DEFAULT 'online',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "food_partners" (
    "food_partner_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "rating" DECIMAL(2,1) DEFAULT 5.0,
    "commission_rate" DECIMAL(4,2) DEFAULT 15.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_partners_pkey" PRIMARY KEY ("food_partner_id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "menu_item_id" SERIAL NOT NULL,
    "food_partner_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "image_url" VARCHAR(255),
    "calories_kcal" INTEGER,
    "protein_g" DECIMAL(5,2),
    "carbs_g" DECIMAL(5,2),
    "fat_g" DECIMAL(5,2),
    "stock_quantity" INTEGER NOT NULL DEFAULT 100,
    "is_out_of_stock" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("menu_item_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "dietary_plan_id" UUID,
    "delivery_address" TEXT NOT NULL,
    "delivery_latitude" DECIMAL(10,8),
    "delivery_longitude" DECIMAL(11,8),
    "delivery_fee" DECIMAL(10,2) DEFAULT 0,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" SERIAL NOT NULL,
    "order_id" UUID NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "partner_orders" (
    "partner_order_id" SERIAL NOT NULL,
    "order_id" UUID NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "accepted_at" TIMESTAMP(3),
    "ready_at" TIMESTAMP(3),

    CONSTRAINT "partner_orders_pkey" PRIMARY KEY ("partner_order_id")
);

-- CreateTable
CREATE TABLE "dietary_plans" (
    "dietary_plan_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,

    CONSTRAINT "dietary_plans_pkey" PRIMARY KEY ("dietary_plan_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" SERIAL NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "course_price" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "course_items" (
    "course_item_id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "sequence" INTEGER,
    "quantity" DECIMAL(5,2) DEFAULT 1,

    CONSTRAINT "course_items_pkey" PRIMARY KEY ("course_item_id")
);

-- CreateTable
CREATE TABLE "meal_plans" (
    "meal_plan_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("meal_plan_id")
);

-- CreateTable
CREATE TABLE "meal_plan_items" (
    "meal_plan_item_id" SERIAL NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "plan_date" DATE NOT NULL,
    "menu_item_id" INTEGER,
    "course_id" INTEGER,
    "meal_type" VARCHAR(20),

    CONSTRAINT "meal_plan_items_pkey" PRIMARY KEY ("meal_plan_item_id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "ingredient_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "is_common_allergen" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "ingredient_aliases" (
    "ingredient_alias_id" SERIAL NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "alias" VARCHAR(100) NOT NULL,

    CONSTRAINT "ingredient_aliases_pkey" PRIMARY KEY ("ingredient_alias_id")
);

-- CreateTable
CREATE TABLE "ingredient_requests" (
    "ingredient_request_id" SERIAL NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredient_requests_pkey" PRIMARY KEY ("ingredient_request_id")
);

-- CreateTable
CREATE TABLE "menu_ingredients" (
    "menu_item_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "menu_ingredients_pkey" PRIMARY KEY ("menu_item_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "disease_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("disease_id")
);

-- CreateTable
CREATE TABLE "user_diseases" (
    "user_id" UUID NOT NULL,
    "disease_id" INTEGER NOT NULL,

    CONSTRAINT "user_diseases_pkey" PRIMARY KEY ("user_id","disease_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "chat_room_id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("chat_room_id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "chat_message_id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL DEFAULT 'text',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("chat_message_id")
);

-- CreateIndex
CREATE INDEX "appointment_start_time_idx" ON "appointment"("start_time");

-- CreateIndex
CREATE INDEX "appointment_patient_id_idx" ON "appointment"("patient_id");

-- CreateIndex
CREATE INDEX "appointment_nutritionist_id_idx" ON "appointment"("nutritionist_id");

-- CreateIndex
CREATE INDEX "orders_patient_id_idx" ON "orders"("patient_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_code_key" ON "ingredients"("code");

-- CreateIndex
CREATE INDEX "ingredients_code_idx" ON "ingredients"("code");

-- CreateIndex
CREATE INDEX "ingredients_category_idx" ON "ingredients"("category");

-- CreateIndex
CREATE INDEX "ingredients_is_common_allergen_idx" ON "ingredients"("is_common_allergen");

-- CreateIndex
CREATE INDEX "ingredient_aliases_ingredient_id_idx" ON "ingredient_aliases"("ingredient_id");

-- CreateIndex
CREATE INDEX "ingredient_aliases_alias_idx" ON "ingredient_aliases"("alias");

-- CreateIndex
CREATE INDEX "ingredient_requests_status_idx" ON "ingredient_requests"("status");

-- CreateIndex
CREATE INDEX "ingredient_requests_requested_by_idx" ON "ingredient_requests"("requested_by");

-- CreateIndex
CREATE INDEX "menu_ingredients_menu_item_id_idx" ON "menu_ingredients"("menu_item_id");

-- CreateIndex
CREATE INDEX "menu_ingredients_ingredient_id_idx" ON "menu_ingredients"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_code_key" ON "diseases"("code");

-- CreateIndex
CREATE INDEX "diseases_code_idx" ON "diseases"("code");

-- CreateIndex
CREATE INDEX "user_diseases_user_id_idx" ON "user_diseases"("user_id");

-- CreateIndex
CREATE INDEX "user_diseases_disease_id_idx" ON "user_diseases"("disease_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_appointment_id_key" ON "chat_rooms"("appointment_id");

-- CreateIndex
CREATE INDEX "chat_messages_chat_room_id_created_at_idx" ON "chat_messages"("chat_room_id", "created_at");

-- CreateIndex
CREATE INDEX "patient_allergies_ingredient_id_idx" ON "patient_allergies"("ingredient_id");

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_food_partner_id_fkey" FOREIGN KEY ("food_partner_id") REFERENCES "food_partners"("food_partner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dietary_plan_id_fkey" FOREIGN KEY ("dietary_plan_id") REFERENCES "dietary_plans"("dietary_plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("menu_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "food_partners"("food_partner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "food_partners"("food_partner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dietary_plans" ADD CONSTRAINT "dietary_plans_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "food_partners"("food_partner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_items" ADD CONSTRAINT "course_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_items" ADD CONSTRAINT "course_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("menu_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_items" ADD CONSTRAINT "meal_plan_items_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("meal_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_items" ADD CONSTRAINT "meal_plan_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("menu_item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_items" ADD CONSTRAINT "meal_plan_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_aliases" ADD CONSTRAINT "ingredient_aliases_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_requests" ADD CONSTRAINT "ingredient_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "food_partners"("food_partner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_ingredients" ADD CONSTRAINT "menu_ingredients_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_ingredients" ADD CONSTRAINT "menu_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_diseases" ADD CONSTRAINT "user_diseases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_diseases" ADD CONSTRAINT "user_diseases_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "diseases"("disease_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("chat_room_id") ON DELETE CASCADE ON UPDATE CASCADE;
