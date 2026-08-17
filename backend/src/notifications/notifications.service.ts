import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const user = this.config.get<string>('GMAIL_USER');
    const pass = this.config.get<string>('GMAIL_APP_PASSWORD');
    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
  }

  private formatOrderSummary(order: Order & { _id: any }) {
    const lines = order.items
      .map((i) => `  - ${i.name} x${i.qty} = Rs. ${i.price * i.qty}`)
      .join('\n');
    return `New Order: ${order.orderNumber}
Customer: ${order.fullName} (${order.phone})
Address: ${order.address}, ${order.area}, ${order.city}
Items:
${lines}
Subtotal: Rs. ${order.subtotal}
Delivery: Rs. ${order.delivery}
Total: Rs. ${order.total}
Payment: ${order.paymentMethod}${order.senderNumber ? ` (sender: ${order.senderNumber})` : ''}${order.transactionId ? `\nTransaction ID: ${order.transactionId} — please verify in your ${order.paymentMethod} account before confirming.` : ''}`;
  }

  async notifyNewOrder(order: Order & { _id: any }) {
    const summary = this.formatOrderSummary(order);
    await Promise.all([
      this.sendEmail(`New Order Received - ${order.orderNumber}`, summary),
      this.sendWhatsApp(summary),
    ]);
  }

  async notifyContactMessage(data: { name: string; email: string; message: string }) {
    const summary = `New contact form message

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}`;
    await Promise.all([
      this.sendEmail(`New Contact Message from ${data.name}`, summary),
      this.sendWhatsApp(summary),
    ]);
  }

  private async sendEmail(subject: string, body: string) {
    if (!this.transporter) {
      this.logger.warn('Email not configured, skipping email notification');
      return;
    }
    const to = this.config.get<string>('ADMIN_EMAIL');
    try {
      await this.transporter.sendMail({
        from: `"YSR Fragrances" <${this.config.get<string>('GMAIL_USER')}>`,
        to,
        subject,
        text: body,
      });
      this.logger.log(`Email sent: ${subject}`);
    } catch (err) {
      this.logger.error('Failed to send email', err as Error);
    }
  }

  private async sendWhatsApp(summary: string) {
    const apiKey = this.config.get<string>('CALLMEBOT_API_KEY');
    const phone = this.config.get<string>('ADMIN_WHATSAPP');
    if (!apiKey || !phone) {
      this.logger.warn('WhatsApp not configured, skipping order WhatsApp notification');
      return;
    }
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${apiKey}&text=${encodeURIComponent(summary)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CallMeBot responded ${res.status}`);
      this.logger.log('Order WhatsApp notification sent');
    } catch (err) {
      this.logger.error('Failed to send order WhatsApp message', err as Error);
    }
  }
}
