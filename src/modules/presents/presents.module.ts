import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Present, PresentSchema } from './schemas/presents.schema';
import { StripeService } from 'src/common/services/stripe/stripe.service';
import { AsaasService } from 'src/common/services/asaas/asaas.service';
import { MercadoPagoService } from 'src/common/services/mercado-pago/mercado-pago.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Present.name, schema: PresentSchema }]),
  ],
  providers: [PresentsService, StripeService, AsaasService, MercadoPagoService],
  controllers: [PresentsController],
  exports: [PresentsService],
})
export class PresentsModule {}
