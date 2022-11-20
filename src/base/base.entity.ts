import { ApiProperty } from '@nestjs/swagger';
import { SAMPLE_DATE } from 'src/utils';
import { Column, PrimaryColumn } from 'typeorm';

export class BaseEntityClass {
  @PrimaryColumn('varchar', { length: 72 })
  id: string;

  @ApiProperty({
    type: Date,
    example: SAMPLE_DATE,
  })
  @Column('timestamp')
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: SAMPLE_DATE,
  })
  @Column('timestamp')
  updatedAt: Date;
}
