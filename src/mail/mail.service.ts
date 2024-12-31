import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { format } from 'date-fns';
import * as handlebars from 'handlebars';

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

  async sendReservationCancellation(
    email: string,
    reserva: any
  ): Promise<void> {
    // Formatear las fechas de manera segura
    const formatDate = (date: string | Date) => {
      try {
        if (typeof date === 'string') {
          return format(new Date(date), 'dd/MM/yyyy');
        }
        return format(date, 'dd/MM/yyyy');
      } catch (error) {
        return 'Fecha no disponible';
      }
    };

    const formatTime = (time: string | Date) => {
      try {
        if (typeof time === 'string') {
          return format(new Date(time), 'HH:mm');
        }
        return format(time, 'HH:mm');
      } catch (error) {
        return 'Hora no disponible';
      }
    };

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmación de Cancelación de Reserva',
      template: './cancellation',
      context: {
        nombre_pasajero: reserva.nombre_pasajero,
        reserva_id: reserva.reserva_id,
        fecha_viaje: formatDate(reserva.fecha_viaje),
        destino_reserva: reserva.destino_reserva,
        numero_asiento: reserva.asiento.numero_asiento,
        metodo_pago: reserva.metodo_pago,
        precio: reserva.precio.toFixed(2)
      },
    });
  }

  async sendPaymentRejected(email: string, rejectionData: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Comprobante de Pago Rechazado',
        template: './payment-rejected',
        context: {
          name: rejectionData.name,
          reason: rejectionData.reason || 'No se proporcionó un motivo específico',
          reservationId: rejectionData.reservationId,
          ticketId: rejectionData.ticketId,
        },
      });
    } catch (error) {
      console.error('Error sending payment rejection email:', error);
    }
  }
}