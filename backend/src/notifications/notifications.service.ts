import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;
  private resend: Resend | null = null;

  constructor(private config: ConfigService) {
    // Resend is preferred — Gmail SMTP reliably gets throttled/dropped once
    // you send more than a handful of automated emails from a personal
    // account. Gmail stays as a fallback if no Resend key is configured.
    const resendKey = this.config.get<string>('RESEND_API_KEY');
    if (resendKey) {
      this.resend = new Resend(resendKey);
    }

    const user = this.config.get<string>('GMAIL_USER');
    const pass = this.config.get<string>('GMAIL_APP_PASSWORD');
    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
  }

  private formatOrderSummary(order: Order & { _id: any }, customerEmail?: string) {
    const lines = order.items
      .map((i) => `  - ${i.name} x${i.qty} = Rs. ${i.price * i.qty}`)
      .join('\n');
    return `New Order: ${order.orderNumber}
Delivery Name: ${order.fullName} (${order.phone})
Account: ${customerEmail || 'unknown — order has no linked account'}
Address: ${order.address}, ${order.area}, ${order.city}
Items:
${lines}
Subtotal: Rs. ${order.subtotal}
Delivery: Rs. ${order.delivery}
Total: Rs. ${order.total}
Payment: ${order.paymentMethod}${order.senderNumber ? ` (sender: ${order.senderNumber})` : ''}${order.transactionId ? `\nTransaction ID: ${order.transactionId} — please verify in your ${order.paymentMethod} account before confirming.` : ''}`;
  }

  async notifyNewOrder(order: Order & { _id: any }, customerEmail?: string) {
    const summary = this.formatOrderSummary(order, customerEmail);
    await Promise.all([
      // Reply-to is the customer's account email (when we have one), so
      // replying to the admin notification reaches them directly.
      this.sendEmail(`New Order Received - ${order.orderNumber} (${customerEmail || order.fullName})`, summary, {
        replyTo: customerEmail ? `"${order.fullName}" <${customerEmail}>` : undefined,
      }),
      this.sendWhatsApp(summary),
      customerEmail ? this.sendOrderConfirmationToCustomer(order, customerEmail) : Promise.resolve(),
    ]);
  }

  /** Sent to the email the customer is logged in with, confirming their order was received. */
  private async sendOrderConfirmationToCustomer(order: Order & { _id: any }, customerEmail: string) {
    const lines = order.items.map((i) => `  - ${i.name} x${i.qty} = Rs. ${i.price * i.qty}`).join('\n');
    const body = `Hi ${order.fullName},

Thanks for your order! Here's a summary:

Order Number: ${order.orderNumber}
Items:
${lines}
Subtotal: Rs. ${order.subtotal}
Delivery: Rs. ${order.delivery}
Total: Rs. ${order.total}
Payment: ${order.paymentMethod}

Delivery Address: ${order.address}, ${order.area}, ${order.city}

We'll notify you as your order is confirmed and shipped.

— Yasir Fragrances`;
    await this.sendEmail(`Your Order Confirmation - ${order.orderNumber}`, body, { to: customerEmail });
  }

  async notifyContactMessage(data: { name: string; email: string; message: string }) {
    const summary = `New contact form message

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}`;
    await Promise.all([
      // replyTo is the customer's own address, so hitting "Reply" in your
      // inbox goes straight to them instead of back to your own Gmail.
      this.sendEmail(`New Contact Message from ${data.name}`, summary, {
        replyTo: `"${data.name}" <${data.email}>`,
      }),
      this.sendWhatsApp(summary),
    ]);
  }

  private async sendEmail(subject: string, body: string, opts: { replyTo?: string; to?: string } = {}) {
    const to = opts.to || this.config.get<string>('ADMIN_EMAIL');
    if (!to) {
      this.logger.warn('No recipient configured (ADMIN_EMAIL missing), skipping email');
      return;
    }

    if (this.resend) {
      try {
        const { error } = await this.resend.emails.send({
          from: this.config.get<string>('RESEND_FROM') || 'Yasir Fragrances <onboarding@resend.dev>',
          to,
          replyTo: opts.replyTo,
          subject,
          text: body,
        });
        if (error) throw error;
        this.logger.log(`Email sent via Resend: ${subject}`);
        return;
      } catch (err: any) {
        // Without a verified domain, Resend's shared sender can only deliver
        // to the address you signed up with — this is the most common failure
        // here, so surface it clearly instead of a generic stack trace.
        this.logger.error(
          `Resend failed to send "${subject}" to ${to}: ${err?.message || err}. ` +
            'If this is a "to" address other than your Resend account email, ' +
            'you need a verified domain on resend.com to send to arbitrary recipients.',
        );
        return;
      }
    }

    if (!this.transporter) {
      this.logger.warn('Email not configured (no RESEND_API_KEY or Gmail credentials), skipping');
      return;
    }
    try {
      await this.transporter.sendMail({
        from: `"Yasir Fragrances" <${this.config.get<string>('GMAIL_USER')}>`,
        to,
        replyTo: opts.replyTo,
        subject,
        text: body,
      });
      this.logger.log(`Email sent via Gmail: ${subject}`);
    } catch (err) {
      this.logger.error('Failed to send email via Gmail', err as Error);
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
