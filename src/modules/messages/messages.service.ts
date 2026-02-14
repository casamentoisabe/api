import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/messages.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  public async create(
    dto: CreateMessageDto,
  ): Promise<{ title: string; message: string; status: HttpStatus }> {
    try {
      await this.messageModel.create(dto);

      return {
        title: 'Mensagem enviada! 💌',
        message: 'Obrigado pelo carinho!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível enviar a sua mensagem, tente novamente!',
      );
    }
  }

  public async findAll(): Promise<Message[]> {
    try {
      return await this.messageModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível carregar as mensagens, tente novamente!',
      );
    }
  }
}
