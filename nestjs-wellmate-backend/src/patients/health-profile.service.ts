import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInYears } from 'date-fns';

@Injectable()
export class HealthProfileService {
    constructor(private prisma: PrismaService) { }

    async getBodyInfo(userId: string) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
            include: {
                user: true,
                healthMetrics: {
                    orderBy: { recordedAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!patient) throw new NotFoundException('Patient not found');

        const latestMetric = patient.healthMetrics[0];
        const age = patient.dateOfBirth
            ? differenceInYears(new Date(), new Date(patient.dateOfBirth))
            : null;

        // 1. Calculate BMI
        let bmi: number | null = null;
        if (latestMetric?.weightKg && latestMetric?.heightCm) {
            const heightInMeters = Number(latestMetric.heightCm) / 100;
            bmi = Number(latestMetric.weightKg) / (heightInMeters * heightInMeters);
        }

        // 2. Calculate BMR (Mifflin-St Jeor Equation)
        let bmr: number | null = null;
        if (
            age !== null &&
            latestMetric?.weightKg &&
            latestMetric?.heightCm &&
            patient.gender
        ) {
            const weight = Number(latestMetric.weightKg);
            const height = Number(latestMetric.heightCm);
            // เทียบตัวพิมพ์เล็กเพื่อความปลอดภัย
            const gender = patient.gender.toLowerCase();

            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
        }

        return {
            personal: {
                // ✅ แก้ไข: ใช้ patient.name แทน firstName/lastName
                name: (patient as any).name || 'Unknown',
                age,
                gender: patient.gender,
                bloodType: patient.bloodType,
            },
            measurements: {
                weight: latestMetric?.weightKg ? Number(latestMetric.weightKg) : null,
                height: latestMetric?.heightCm ? Number(latestMetric.heightCm) : null,
                recordedAt: latestMetric?.recordedAt || null,
            },
            stats: {
                bmi: bmi ? parseFloat(bmi.toFixed(2)) : null,
                bmr: bmr ? Math.round(bmr) : null,
                status: this.getBMIStatus(bmi),
            },
            medical: {
                chronicDiseases: patient.chronicDiseases,
            },
            goals: {
                goal: patient.healthMetrics?.[0]?.goal || null, // <--- เติมลูกน้ำตรงนี้
                activityLevel: patient.healthMetrics?.[0]?.activityLevel || null, // <--- เติมลูกน้ำตรงนี้
                healthMetrics: patient.healthMetrics?.[0] || null
            } // ลบเซมิโคลอน ; ตรงนี้ออก
        };
    } // <--- ปีกกานี้คือปิดฟังก์ชัน getBodyInfo

    private getBMIStatus(bmi: number | null) {
        if (!bmi) return 'Unknown';
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight'; // เติมส่วนนี้
        if (bmi < 30) return 'Overweight';    // เติมส่วนนี้
        return 'Obese';                       // เติมส่วนนี้
    }
}
