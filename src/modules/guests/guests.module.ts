import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from './schemas/guests.schema';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
    MailModule,
  ],
  controllers: [GuestsController],
  providers: [GuestsService, MailService],
  exports: [GuestsService],
})
export class GuestsModule {}
