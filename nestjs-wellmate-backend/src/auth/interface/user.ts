import { User, Patient, Nutritionist, FoodPartner, Admin } from '@prisma/client';

export interface UserWithRelation extends User {
  patient?: Patient | null;
  nutritionist?: Nutritionist | null;
  foodPartner?: FoodPartner | null;
  admin?: Admin | null;
}