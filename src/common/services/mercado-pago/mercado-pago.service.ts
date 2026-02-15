import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  public async createPreference(present: any) {
    const preference = new Preference(this.client);

    const response = await preference.create({
      body: {
        payment_methods: {
          installments: 12,
        },
        items: [
          {
            id: present._id.toString(),
            title: present.name,
            quantity: 1,
            unit_price: present.price,
            currency_id: 'BRL',
            picture_url: present.photo,
          },
        ],
        back_urls: {
          success: `${process.env.APP_URL}/presentes/sucesso?id=${present._id}`,
          failure: `${process.env.APP_URL}/presentes`,
          pending: `${process.env.APP_URL}/presentes`,
        },
        auto_return: 'approved',
        notification_url: `https://theoretical-colleen-casamento-isa-e-be-77ce0833.koyeb.app/presents/webhook/v3`,
        metadata: {
          presentId: present._id.toString(),
        },
      },
    });

    return response;
  }
}
