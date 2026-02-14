import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  list() {
    return this.messageService.findAll();
  }
}
