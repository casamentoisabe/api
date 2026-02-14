import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Present, PresentSchema } from './schemas/presents.schema';
import { StripeService } from 'src/common/services/stripe/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Present.name, schema: PresentSchema }]),
  ],
  providers: [PresentsService, StripeService],
  controllers: [PresentsController],
  exports: [PresentsService],
})
export class PresentsModule {}
