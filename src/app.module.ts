import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestsModule } from './modules/guests/guests.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
