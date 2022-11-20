import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DataType } from 'src/user/user.entity';

export class RegisterBody {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DataType)
  type: DataType;
}

export class VerifyTokenBody {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
