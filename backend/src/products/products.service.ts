import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

export interface ProductQuery {
  q?: string;
  gender?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: ProductQuery = {}) {
    const filter: Record<string, any> = {};

    if (query.q) filter.name = { $regex: query.q, $options: 'i' };
    if (query.gender) filter.gender = query.gender;
    if (query.category) filter.category = query.category;
    if (query.inStock) filter.stock = { $gt: 0 };
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (query.sort === 'price-asc') sort = { price: 1 };
    if (query.sort === 'price-desc') sort = { price: -1 };
    if (query.sort === 'rating') sort = { rating: -1 };

    return this.productModel.find(filter).sort(sort);
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
