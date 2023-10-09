import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, id: true, collection: 'inventory' })
export class Inventory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantityType: string;

  @Prop({ required: true })
  quantity: number;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
