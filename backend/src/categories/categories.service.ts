import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  findAll() {
    return this.categoryModel.find();
  }

  create(data: Partial<Category>) {
    return this.categoryModel.create(data);
  }

  async update(id: string, data: Partial<Category>) {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundException('Category not found');
    return { deleted: true };
  }
}
