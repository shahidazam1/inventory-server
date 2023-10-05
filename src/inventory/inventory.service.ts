import {
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  CreateInventoryDto,
  InventoryQueryDto,
} from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './schema/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}

  async create(body: CreateInventoryDto) {
    try {
      const isInventoryExist = await this.inventoryModel.findOne({
        name: body.name,
      });

      if (isInventoryExist) {
        throw new UnprocessableEntityException('Inventory Already Exist');
      }

      await this.inventoryModel.create(body);

      return {
        success: true,
        message: 'Inventory Added Successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query: InventoryQueryDto) {
    try {
      const params = {};
      if (query.search) {
        params['$or'] = [{ name: { $regex: query.search, $options: 'i' } }];
      }

      const count = await this.inventoryModel.countDocuments(params).exec();

      const data = await this.inventoryModel
        .find(params)
        .skip(+query?.offset || 0)
        .limit(+query?.limit || Number.MAX_SAFE_INTEGER)
        .sort({ createdAt: -1 })
        .exec();

      return {
        count,
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: ObjectId, body: UpdateInventoryDto) {
    try {
      const isInventoryExist = await this.inventoryModel.findById(id).exec();

      if (!isInventoryExist) {
        throw new NotFoundException(
          "Sorry, We Can't find Inventory. Please Try Again   ",
        );
      }

      const IsInventoryNameExists = await this.inventoryModel
        .findOne({ name: body.name })
        .exec();

      if (IsInventoryNameExists) {
        throw new UnprocessableEntityException('Inventory Already Exists');
      }

      await this.inventoryModel
        .updateOne(
          {
            _id: id,
          },
          {
            $set: {
              name: body.name,
            },
          },
        )
        .exec();

      return {
        success: true,
        message: 'Inventory Updated Successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: ObjectId) {
    try {
      const inventory = await this.inventoryModel.findById(id).exec();
      if (!inventory) {
        throw new NotFoundException(`Hosteler with id ${id} not found`);
      }

      await inventory.deleteOne();

      return {
        success: true,
        message: `Inventory with name ${inventory.name} deleted successfully`,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
