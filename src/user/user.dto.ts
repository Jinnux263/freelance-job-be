import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from './user.entity';

export class UserRequest {
  id?: string = null;

  username?: string = null;

  constructor(init: Partial<UserRequest>) {
    return Object.assign(this, init);
  }
}

export class UserCreation {
  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'johndoe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Initial password',
    type: String,
    example: 'p@ssw0rd',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User firstName',
    type: String,
    example: 'David',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User lastName',
    type: String,
    required: false,
    example: 'Laid',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User address',
    type: String,
    required: false,
    example: '17 Ems Road, CSE, Ho Chi Minh city',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'User city',
    type: String,
    required: false,
    example: 'Ho Chi Minh city University of Technology',
  })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'User country',
    type: String,
    required: false,
    example: 'Viet Nam',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    required: false,
    example: 'CSE, Ho Chi Minh city University of Technology',
  })
  @IsOptional()
  @IsString()
  organization: string;

  // @ApiProperty({
  //   description: 'Role of User',
  //   enum: UserRole,
  //   example: UserRole.USER,
  // })
  // @IsNotEmpty()
  // @IsEnum(UserRole)
  // role: UserRole;

  constructor(init: Partial<UserCreation>) {
    return Object.assign(this, init);
  }
}

export class UserUpdation extends UserCreation {}

export class UserSelfUpdation extends UserCreation {}
