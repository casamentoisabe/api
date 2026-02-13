import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Guest, GuestDocument } from './schemas/guests.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGuessDto } from './dto/create-guest.dto';
import { json } from 'express';
import { MailService } from '../mail/mail.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
    private mailService: MailService,
  ) {}

  public async create(
    dto: CreateGuessDto,
  ): Promise<{ title: string; message: string; status: HttpStatus }> {
    const { email, name, confirmed, restrictions } = dto;

    try {
      const guest = await this.guestModel.findOne({ email }).exec();

      if (guest) {
        if (guest.confirmed === confirmed) {
          throw new ConflictException('Você já informou esse status.');
        }

        guest.name = name;
        guest.confirmed = confirmed;
        guest.restrictions = restrictions!;
        await guest.save();

        if (confirmed === 'Sim') {
          this.mailService.sendInvite(name, email).catch((error) => {
            console.error('Erro ao enviar email:', error);
          });
        }

        return {
          title:
            confirmed === 'Sim'
              ? 'Presença confirmada! 🎉'
              : 'Recebemos a sua atualização',
          message:
            confirmed === 'Sim'
              ? `Que bom que poderemos contar com a sua presença, ${name?.split(' ')[0]}!`
              : `Que pena que não teremos você conosco, ${name?.split(' ')[0]}.`,
          status: HttpStatus.OK,
        };
      }

      await this.guestModel.create(dto);

      if (confirmed === 'Sim') {
        this.mailService.sendInvite(name, email).catch((error) => {
          console.error('Erro ao enviar email:', error);
        });
      }

      return {
        title:
          confirmed === 'Sim'
            ? 'Presença confirmada! 🎉'
            : 'Obrigado por avisar',
        message:
          confirmed === 'Sim'
            ? `Obrigado, ${name?.split(' ')[0]}! Estamos ansiosos para celebrar com você.`
            : 'Será uma pena não ter você conosco.',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Não foi possível confirmar sua presença, tente novamente!',
      );
    }
  }

  public async findAll(): Promise<Guest[]> {
    return this.guestModel.find().exec();
  }
}
