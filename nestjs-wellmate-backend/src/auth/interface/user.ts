// ลบ Interface ด้านบนทิ้งให้หมด แล้วเขียนแค่นี้พอครับ!
import { User, Patient, Nutritionist, FoodPartner } from '@prisma/client';

export interface UserWithRelation extends User {
  patient?: Patient | null;
  nutritionist?: Nutritionist | null;
  foodPartner?: FoodPartner | null;
}