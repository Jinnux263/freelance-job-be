import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from 'src/contact/entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), UserModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
