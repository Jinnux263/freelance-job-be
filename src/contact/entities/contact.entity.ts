import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Column, PrimaryColumn } from 'typeorm';

export class Contact extends BaseEntityClass {
  @ApiProperty({
    description: 'Poll ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Guest name',
    type: String,
  })
  @Column('varchar', { nullable: false })
  name: string;

  @ApiProperty({
    description: 'Contact email',
    type: String,
  })
  @Column('text', { nullable: false })
  email: string;

  @ApiProperty({
    description: 'Contact number',
    type: String,
  })
  @Column('varchar', { nullable: false })
  phoneNumber: string;
}
