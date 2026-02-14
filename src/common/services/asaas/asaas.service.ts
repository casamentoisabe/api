import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AsaasService {
  private readonly baseUrl = process.env.ASAAS_API_URL;

  private readonly apiKey = process.env.ASAAS_SECRET_KEY;

  private get headers() {
    return {
      access_token: this.apiKey,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  public async createCustomer(name: string, email: string) {
    const response = await axios.post(
      `${this.baseUrl}/customers`,
      {
        name,
        email,
      },
      { headers: this.headers },
    );

    return response.data;
  }

  public async createPayment(present: any) {
    const response = await axios.post(
      `${this.baseUrl}/checkouts`,
      {
        billingTypes: ['CREDIT_CARD', 'PIX'],
        chargeTypes: ['DETACHED', 'INSTALLMENT'],
        callback: {
          successUrl: `${process.env.APP_URL}/presentes/sucesso?id=${present._id}`,
          cancelUrl: `${process.env.APP_URL}/presentes`,
        },
        items: [
          {
            imageBase64: present.photo,
            name: present.name,
            quantity: 1,
            value: present.price,
            description: present.description,
          },
        ],
        installment: { maxInstallmentCount: 12 },
      },
      { headers: this.headers },
    );

    return response.data;
  }
}
