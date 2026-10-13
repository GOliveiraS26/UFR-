import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { PixPayment } from './payments/PixPayment';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const orderRepository = new PrismaOrderRepository(prisma);
const mailProvider = new EtherealMailProvider();

const paymentMethods = {
  credit_card: new CreditCardPayment(),
  pix: new PixPayment(),
};

const notificationService = new NotificationService(mailProvider);
const orderService = new OrderService(orderRepository, notificationService, paymentMethods);
const orderController = new OrderController(orderService);

app.post('/orders', orderController.processOrder);

export default app;
