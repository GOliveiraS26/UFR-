import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(customer: string, orderId: number, total: number, products: any[]) {
    return await this.mailProvider.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to: customer,
      subject: `Confirmação do Pedido #${orderId}`,
      text: `Olá, seu pedido #${orderId} no valor de R$ ${total} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${total}</strong></p>
        <ul>
          ${products.map(p => `<li>${p.name}</li>`).join('')}
        </ul>
      `,
    });
  }
}
