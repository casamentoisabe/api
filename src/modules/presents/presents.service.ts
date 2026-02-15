import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Present, PresentDocument } from './schemas/presents.schema';
import { Model } from 'mongoose';
import { StripeService } from 'src/common/services/stripe/stripe.service';
import { CreatePresentDto } from './dto/create-present.dto';
import { AsaasService } from 'src/common/services/asaas/asaas.service';
import { MercadoPagoService } from 'src/common/services/mercado-pago/mercado-pago.service';

@Injectable()
export class PresentsService {
  constructor(
    @InjectModel(Present.name) private presentModel: Model<PresentDocument>,
    private stripeService: StripeService,
    private asaasService: AsaasService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  public async create(
    dto: CreatePresentDto,
  ): Promise<{ title: string; message: string; status: HttpStatus }> {
    try {
      await this.presentModel.create(dto);

      return {
        title: 'Presente criado',
        message: 'Presente criado com sucesso!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível criar este presente, tente novamente!',
      );
    }
  }

  public async findAll(): Promise<Present[]> {
    try {
      return await this.presentModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível carregar os presentes, tente novamente!',
      );
    }
  }

  public async findOne(id: string): Promise<Present | null> {
    try {
      return await this.presentModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível carregar o item, tente novamente!',
      );
    }
  }

  // ---------------------------- API STRIPE ---------------------------- //

  public async createCheckout(presentId: string) {
    const present = await this.presentModel.findById(presentId);

    if (!present || present.purchased) {
      throw new BadRequestException('Presente indisponível');
    }

    return this.stripeService.createCheckoutSession(present);
  }

  // ---------------------------- API ASAAS ---------------------------- //

  public async createCheckoutV2(presentId: string) {
    const present = await this.presentModel.findById(presentId);

    const payment = await this.asaasService.createPayment(present);

    return {
      invoiceUrl: payment.invoiceUrl,
    };
  }

  // ---------------------------- API MERCADO PAGO ---------------------------- //

  public async createCheckoutV3(presentId: string) {
    const updated = await this.presentModel.findOneAndUpdate(
      {
        _id: presentId,
        purchased: false,
        reserved: { $ne: true }, // evita dupla reserva
      },
      {
        reserved: true,
        reservedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new Error('Presente já reservado ou comprado');
    }

    const preference = await this.mercadoPagoService.createPreference(updated);

    return {
      url: preference.init_point,
    };
  }
}
