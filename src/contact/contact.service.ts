import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

  createContact(createContactDto: CreateContactDto) {
    return 'This action adds a new contact';
  }

  findAllContact(authUser: AuthUser) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      return this.findAll();
    });
  }

  findOneContact(authUser: AuthUser, id: string) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      return `This action returns a #${id} contact`;
    });
  }

  updateContact(
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

        const newComment = await this.contactRepository.update(
          id,
          updateContactDto,
        );
        return updateContactDto;
      } catch (err) {
        throw new InternalServerErrorException('Internal Error');
      }
    });
  }

  removeContact(authUser: AuthUser, id: string) {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      try {
        const contact = await this.findById(id);
        if (!contact) {
          throw new NotFoundException('There is no contact');
        }

        await this.deleteById(id);
        return new BaseResponse(200, 'Delete #${id} contact successfully');
      } catch (err) {
        throw new InternalServerErrorException('Internal Error');
      }
    });
  }
}
