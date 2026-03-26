import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

// หากคุณมี Enum สำหรับ Status สามารถนำมาใช้ได้ หรือใช้ String ปกติก่อนครับ
export class CreateNutritionOrderDto {
    @ApiProperty({
        description: 'สถานะของออร์เดอร์',
        example: 'DELIVERED',
        required: false
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({
        description: 'หมายเหตุเพิ่มเติม',
        example: 'ส่งที่ตึก A ชั้น 2',
        required: false
    })
    @IsOptional()
    @IsString()
    note?: string;

    // เพิ่มฟิลด์อื่นๆ ที่คุณอาจต้องใช้ในอนาคตที่นี่ เช่น
    // @IsOptional()
    // @IsString()
    // recipientName?: string;
}