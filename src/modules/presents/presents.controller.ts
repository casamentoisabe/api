import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { PresentsService } from './presents.service';
import { StripeService } from 'src/common/services/stripe/stripe.service';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Present, PresentDocument } from './schemas/presents.schema';
import { Model } from 'mongoose';
import express from 'express';
import { CreatePresentDto } from './dto/create-present.dto';
import axios from 'axios';

@Controller('presents')
export class PresentsController {
  constructor(
    private readonly presentsService: PresentsService,
    private stripeService: StripeService,
    @InjectModel(Present.name) private presentModel: Model<PresentDocument>,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePresentDto) {
    return this.presentModel.create(dto);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  list() {
    return this.presentsService.findAll();
  }

  @Get('list/:id/present')
  @HttpCode(HttpStatus.OK)
  listOne(@Param('id') id: string) {
    return this.presentsService.findOne(id);
  }

  // ---------------------------- API STRIPE ---------------------------- //

  @Post(':id/checkout')
  public async checkout(@Param('id') id: string) {
    const session = await this.presentsService.createCheckout(id);
    return { url: session.url };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: express.Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripeService.constructWebhookEvent(req.body, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const presentId = session.metadata?.presentId;

      await this.presentModel.findByIdAndUpdate(presentId, {
        purchased: true,
      });
    }

    return { received: true };
  }

  // ---------------------------- API ASAAS ---------------------------- //

  @Post(':id/checkout/v2')
  public async checkoutV2(@Param('id') id: string) {
    return await this.presentsService.createCheckoutV2(id);
  }

  @Post('webhook/v2')
  async handleWebhookV2(@Req() req: express.Request) {
    const body = req.body;

    if (body.event === 'CHECKOUT_PAID') {
      console.log('TESTE', body);
    }

    // Retorne uma resposta para dizer que o webhook foi recebido
    return { received: true };
  }

  // ---------------------------- API MERCADO PAGO ---------------------------- //

  @Post(':id/checkout/v3')
  async checkoutV3(@Param('id') id: string) {
    return this.presentsService.createCheckoutV3(id);
  }

  @Post('webhook/v3')
  @HttpCode(200)
  async handleWebhookV3(@Body() body: any) {
    // if (body.type === 'payment') {
    //   const paymentId = body.data.id;

    //   // Buscar pagamento
    //   const payment = await fetch(
    //     `https://api.mercadopago.com/v1/payments/${paymentId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}`,
    //       },
    //     },
    //   ).then((res) => res.json());

    //   if (payment.status === 'approved') {
    //     const presentId = payment.metadata.presentId;

    //     await this.presentModel.findByIdAndUpdate(presentId, {
    //       purchased: true,
    //     });
    //   }
    // }

    // return { received: true };

    // console.log('WEBHOOK COMPLETO:', JSON.stringify(body, null, 2));
    // console.log('#### Webhook DATA:', body?.data);

    // const paymentId = body?.data?.id;

    // if (!paymentId) {
    //   return { received: true };
    // }

    // const { data: payment } = await axios.get(
    //   `https://api.mercadopago.com/v1/payments/${paymentId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    //     },
    //   },
    // );
    const payment = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    ).then((res) => res.json());

    console.log('######### Webhook PAYMENT:', payment);

    if (payment.status === 'approved') {
      const presentId = payment.metadata?.present_id;
      console.log('entrou aqui????', presentId);

      await this.presentModel.findByIdAndUpdate(presentId, {
        purchased: true,
      });
    }

    return { received: true };
  }
}
