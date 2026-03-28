import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class UpdateApprovalDto { // เปลี่ยนชื่อ Class ให้ตรงกับชื่อไฟล์
    @IsEnum(VerificationStatus)
    status: VerificationStatus;

    @IsOptional()
    @IsString()
    reason?: string;
}