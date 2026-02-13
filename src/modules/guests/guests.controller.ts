import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuessDto } from './dto/create-guest.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateGuessDto) {
    return this.guestsService.create(dto);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  list() {
    return this.guestsService.findAll();
  }
}
