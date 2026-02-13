import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuestDocument = Guest & Document;

@Schema({ timestamps: true })
export class Guest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  confirmed: 'Sim' | 'Não';

  @Prop()
  restrictions: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
