import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class VerifyTokenBody {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
