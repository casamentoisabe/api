import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PresentDocument = Present & Document;

@Schema({ timestamps: true })
export class Present {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  idCategory: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  photo: string;

  @Prop({ default: false })
  purchased: boolean;

  @Prop()
  purchasedBy?: string;
}

export const PresentSchema = SchemaFactory.createForClass(Present);
