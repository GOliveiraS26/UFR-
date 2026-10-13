import { IOrderRepository } from '../repositories/IOrderRepository';
import { ProductFactory } from '../domain/ProductFactory';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import logger from '../lib/logger';

export class OrderValidationError extends Error {}

export interface OrderInput {
  customer: string;
  items: { productId: number; quantity: number }[];
  paymentMethod: string;
  paymentDetails: any;
}

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private notificationService: NotificationService,
    private paymentMethods: Record<string, IPaymentMethod>
  ) {}

  async processOrder(input: OrderInput) {
    const { customer, items, paymentMethod, paymentDetails } = input;

    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new OrderValidationError('Carrinho vazio');
    }

    let totalAmount = 0;
    const productsDetails = [];

    for (const item of items) {
      const productData = await this.orderRepository.findProductById(item.productId);

      if (!productData) {
        throw new OrderValidationError(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(productData);
      totalAmount += (product.price * item.quantity) + product.calculateFreight();

      productsDetails.push({ ...productData, quantity: item.quantity });
    }

    const payment = this.paymentMethods[paymentMethod];
    if (!payment) {
      throw new OrderValidationError('Método de pagamento não suportado');
    }

    await payment.process(totalAmount, paymentDetails);

    const order = await this.orderRepository.create({
      customer,
      items: productsDetails,
      total: totalAmount,
      status: 'confirmed',
    });

    const emailPreview = await this.notificationService.sendOrderConfirmation(
      customer,
      order.id,
      totalAmount,
      productsDetails
    );

    return {
      orderId: order.id,
      emailPreview,
    };
  }
}
