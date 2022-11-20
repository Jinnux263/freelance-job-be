import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { SAMPLE_TOKEN } from 'src/utils';

export interface IRequestWithUser extends Request {
  user: User;
  token: string;
}

export class ILoginResponse {
  @ApiProperty({
    description: 'User Information',
    type: User,
    example: new User(),
  })
  user: User;

  @ApiProperty({
    description: 'User Token',
    type: String,
    example: SAMPLE_TOKEN,
  })
  token: string;
}

export class ResetPassResponse {
  @ApiProperty({
    description: 'User New Password',
    type: String,
    example: 'password',
  })
  password: string;
}

export class ResetPassRequest {
  @ApiProperty({
    description: 'User Username',
    type: String,
    example: 'username',
  })
  @IsNotEmpty()
  username: string;

  // Can validate mat khau truoc khi luu nua
  @ApiProperty({
    description: 'User New Password',
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
