import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BaseResponse } from 'src/base/base.dto';
import { BaseService } from 'src/base/base.service';
import { RequestContactDto } from 'src/contact/dto/request-contact.dto';
import { Contact } from 'src/contact/entities/contact.entity';
import { UserService } from 'src/user/user.service';
import { IdPrefix } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService extends BaseService<
  Contact,
  CreateContactDto,
  RequestContactDto
> {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly userService: UserService,
  ) {
    super(contactRepository, IdPrefix.CONTACT);
  }

  async createContact(createContactDto: CreateContactDto) {
    return await this.create(createContactDto);
  }

  async findAllContact(authUser: AuthUser) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      return this.findAll();
    });
  }

  async findOneContact(authUser: AuthUser, id: string) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      return await this.findById(id);
    });
  }

  async updateContact(
    authUser: AuthUser,
    id: string,
    updateContactDto: UpdateContactDto,
  ) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      try {
        const contact = await this.findById(id);
        if (!contact) {
          throw new NotFoundException('There is no contact');
        }
        await this.update(id, updateContactDto);
        return updateContactDto;
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    });
  }

  async removeContact(authUser: AuthUser, id: string) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      try {
        const contact = await this.findById(id);
        if (!contact) {
          throw new NotFoundException('There is no contact');
        }
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
      try {
        await this.deleteById(id);
        return new BaseResponse(200, `Delete #${id} contact successfully`);
      } catch (err) {
        throw new ConflictException(err.message);
      }
    });
  }
}
