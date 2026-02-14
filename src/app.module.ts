import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestsModule } from './modules/guests/guests.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { MessagesModule } from './modules/messages/messages.module';
import { StripeService } from './common/services/stripe/stripe.service';
import { PresentsModule } from './modules/presents/presents.module';
import * as env from 'dotenv';

env.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.STRING_CONNECTION || 'mongodb://localhost/casamento',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    GuestsModule,
    MailModule,
    MessagesModule,
    PresentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, StripeService],
})
export class AppModule {}
