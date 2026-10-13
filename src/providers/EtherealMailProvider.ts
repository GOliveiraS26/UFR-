import nodemailer from 'nodemailer';
import { IMailProvider, MailMessage } from './IMailProvider';
import logger from '../lib/logger';

export class EtherealMailProvider implements IMailProvider {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter() {
    if (this.transporter) return this.transporter;

    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    logger.info(`Ethereal Mail configurado: ${testAccount.user}`);
    return this.transporter;
  }

  async sendMail(message: MailMessage): Promise<string | undefined> {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail(message);
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

    logger.info(`Email enviado: ${previewUrl}`);
    return previewUrl;
  }
}
