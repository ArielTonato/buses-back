import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendReservationConfirmation(email: string, reservationData: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmación de Reserva',
        template: './confirmation',
        context: {
          name: reservationData.name,
          reservationId: reservationData.reservationId,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendReservation(email: string, reservationData: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reserva realizada',
        template: './reservation',
        context: {
          name: reservationData.name,
          reservationId: reservationData.reservationId,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendPaymentConfirmation(email: string, paymentData: any) {
    try {
      await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmación de Pago',
      template: './payment',
      context: {
        name: paymentData.name,
        amount: paymentData.amount,
        paymentId: paymentData.id,
      },
    });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}