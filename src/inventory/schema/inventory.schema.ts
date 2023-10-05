import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, id: true, collection: 'inventory' })
export class Inventory extends Document {
  @Prop({ required: true })
  name: string;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
