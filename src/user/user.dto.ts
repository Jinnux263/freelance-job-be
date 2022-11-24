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
    description: 'Full Name of User',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

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
    description: 'Role of User',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'User Email',
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  mail: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    required: false,
    example: 'CSE, Ho Chi Minh city University of Technology',
  })
  @IsOptional()
  organization: string;

  constructor(init: Partial<UserCreation>) {
    return Object.assign(this, init);
  }
}

export class UserUpdation {
  @ApiProperty({
    description: 'Full Name of User',
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Role of User',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @ApiProperty({
    description: 'User Email',
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  mail: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    required: false,
    example: 'CSE, Ho Chi Minh city University of Technology',
  })
  @IsOptional()
  organization: string;

  constructor(init: Partial<UserCreation>) {
    return Object.assign(this, init);
  }
}

export class UserSelfUpdation {
  @ApiProperty({
    description: 'Full Name of User',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  mail: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    required: false,
    example: 'CSE, Ho Chi Minh city University of Technology',
  })
  @IsOptional()
  organization: string;

  constructor(init: Partial<UserCreation>) {
    return Object.assign(this, init);
  }
}
