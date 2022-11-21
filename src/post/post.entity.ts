import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Post extends BaseEntityClass {
  @ApiProperty({
    description: 'Post ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Caption',
    type: String,
  })
  @Column('varchar', { length: 32, unique: true })
  caption: string;

  @ApiProperty({
    description: 'Post picture',
    type: String,
  })
  @Column('text', { nullable: true })
  postpicture: string;
}
