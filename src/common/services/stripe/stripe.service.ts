import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
    });
  }

  public async createCheckoutSession(present: any) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: present.name,
              description: present.description,
              images: [present.photo],
            },
            unit_amount: present.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/presentes/sucesso?id=${present._id}`,
      cancel_url: `${process.env.APP_URL}/presentes`,
      metadata: {
        presentId: present._id.toString(),
      },
    });
  }

  public constructWebhookEvent(body: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }
}
