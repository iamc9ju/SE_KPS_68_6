-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('patient', 'nutritionist', 'admin');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('mild', 'moderate', 'severe');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('online');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL,
    "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_fa_secret" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "gender" "GenderType",
    "blood_type" VARCHAR(5),
    "chronic_diseases" TEXT[],
    "is_profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "nutritionists" (
    "nutritionist_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "license_number" VARCHAR(50),
    "license_document_url" VARCHAR(500),
    "consultation_fee" DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMP(3),
    "verified_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "nutritionists_pkey" PRIMARY KEY ("nutritionist_id")
);

-- CreateTable
CREATE TABLE "patient_allergies" (
    "patient_allergy_id" SERIAL NOT NULL,
    "patient_id" UUID NOT NULL,
    "ingredient_name" VARCHAR(100) NOT NULL,
    "severity" "AllergySeverity" NOT NULL DEFAULT 'moderate',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("patient_allergy_id")
);

-- CreateTable
CREATE TABLE "health_metrics" (
    "health_metric_id" SERIAL NOT NULL,
    "patient_id" UUID NOT NULL,
    "weight_kg" DECIMAL(5,2),
    "height_cm" DECIMAL(5,2),
    "body_fat_percent" DECIMAL(4,1),
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("health_metric_id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "refresh_token_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "device_id" VARCHAR(255),
    "used_at" TIMESTAMP(3),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "family" UUID,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refresh_token_id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "specialty_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("specialty_id")
);

-- CreateTable
CREATE TABLE "nutritionist_specialties" (
    "nutritionist_id" UUID NOT NULL,
    "specialty_id" INTEGER NOT NULL,

    CONSTRAINT "nutritionist_specialties_pkey" PRIMARY KEY ("nutritionist_id","specialty_id")
);

-- CreateTable
CREATE TABLE "nutritionist_schedules" (
    "nutritionist_schedule_id" SERIAL NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "nutritionist_schedules_pkey" PRIMARY KEY ("nutritionist_schedule_id")
);

-- CreateTable
CREATE TABLE "nutritionist_leaves" (
    "nutritionist_leave_id" SERIAL NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "leave_date" DATE NOT NULL,
    "is_full_day" BOOLEAN NOT NULL DEFAULT true,
    "new_start_time" TEXT,
    "new_end_time" TEXT,

    CONSTRAINT "nutritionist_leaves_pkey" PRIMARY KEY ("nutritionist_leave_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "appointment_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "appointment_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "nutritionist_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "type" "AppointmentType" NOT NULL DEFAULT 'online',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutritionists_user_id_key" ON "nutritionists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutritionists_license_number_key" ON "nutritionists"("license_number");

-- CreateIndex
CREATE INDEX "patient_allergies_patient_id_idx" ON "patient_allergies"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_idx" ON "refresh_tokens"("family");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_appointment_id_key" ON "reviews"("appointment_id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionists" ADD CONSTRAINT "nutritionists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionist_specialties" ADD CONSTRAINT "nutritionist_specialties_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionist_specialties" ADD CONSTRAINT "nutritionist_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("specialty_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionist_schedules" ADD CONSTRAINT "nutritionist_schedules_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionist_leaves" ADD CONSTRAINT "nutritionist_leaves_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "nutritionists"("nutritionist_id") ON DELETE RESTRICT ON UPDATE CASCADE;
