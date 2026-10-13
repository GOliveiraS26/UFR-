import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  process(amount: number): void {
    logger.info(`Processando Pix no valor de R$ ${amount}...`);
  }
}
