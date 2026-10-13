import { PrismaClient } from '@prisma/client';
import { IOrderRepository, CreateOrderData } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  async findProductById(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: CreateOrderData) {
    const order = await this.prisma.order.create({
      data: {
        customer: data.customer,
        items: JSON.stringify(data.items),
        total: data.total,
        status: data.status,
      },
    });

    return { id: order.id };
  }
}
