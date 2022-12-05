import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, Public } from 'src/auth/auth-user.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('Contact API')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }

  @Get()
  findAll(@Request() request: { user: AuthUser }) {
    return this.contactService.findAllContact(request.user);
  }

  @Get(':id')
  findOne(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.contactService.findOneContact(request.user, id);
  }

  @Patch(':id')
  update(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.updateContact(
      request.user,
      id,
      updateContactDto,
    );
  }

  @Delete(':id')
  remove(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.contactService.removeContact(request.user, id);
  }
}
