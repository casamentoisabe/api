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

@Injectable()
export class PresentsService {
  constructor(
    @InjectModel(Present.name) private presentModel: Model<PresentDocument>,
    private stripeService: StripeService,
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

  public async createCheckout(presentId: string) {
    const present = await this.presentModel.findById(presentId);

    if (!present || present.purchased) {
      throw new BadRequestException('Presente indisponível');
    }

    return this.stripeService.createCheckoutSession(present);
  }
}
