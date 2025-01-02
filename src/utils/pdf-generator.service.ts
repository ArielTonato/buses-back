import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

interface TicketData {
  cooperativa: string;
  direccion: string;
  ruc: string;
  fechaViaje: string;
  horaViaje: string;
  asientos: string;
  numeroAutobus: string;
  tipoPago: string;
  identificacionUsuario: string;
  nombreUsuario: string;
  destino: string;
  cantidad: number;
  precioUnitario: number;
}

@Injectable()
export class PdfGeneratorService {
  async generateTicket(data: TicketData): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: [283.46, 566.93], 
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });


      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));


      doc.font('Helvetica-Bold');

      doc.fontSize(12).text(data.cooperativa.toUpperCase(), { align: 'center' });
      doc.fontSize(8).text(data.direccion, { align: 'center' });
      doc.text(`RUC: ${data.ruc}`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text('FACTURA', { align: 'center', underline: true });
      doc.moveDown();

      doc.moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();

      doc.moveDown(0.5);


      doc.fontSize(8).font('Helvetica');
      doc.text(`Fecha de Viaje: ${data.fechaViaje}`, { continued: true, align: 'left' });
      doc.text(`Hora: ${data.horaViaje}`, { align: 'right' });
      doc.text(`Número de Autobús: ${data.numeroAutobus}`, { align: 'left' });
      doc.text(`Número de Asiento(s): ${data.asientos}`, { align: 'right' });
      doc.moveDown();

      // Línea divisoria
      doc.moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();

      doc.moveDown(0.5);

      // Información del pasajero
      doc.text(`Nombre del Pasajero: ${data.nombreUsuario}`);
      doc.text(`Identificación: ${data.identificacionUsuario}`);
      doc.text(`Destino: ${data.destino}`);
      doc.moveDown();

      // Línea divisoria
      doc.moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();

      doc.moveDown(0.5);

      // Detalles del pago
      doc.fontSize(10).text('DETALLES DEL PAGO', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(8);
      doc.text(`Método de Pago: ${data.tipoPago}`);
      doc.text(`Cantidad de Asientos: ${data.cantidad}`);
      doc.text(`Precio Unitario: $${data.precioUnitario.toFixed(2)}`);
      doc.text(`Total a Pagar: $${(data.cantidad * data.precioUnitario).toFixed(2)}`, {
        align: 'right',
      });

      doc.moveDown();

      // Pie de página
      doc.fontSize(7).font('Helvetica-Oblique');
      doc.text('Gracias por confiar en nosotros.', { align: 'center' });
      doc.text('Este documento es válido como comprobante de viaje.', { align: 'center' });

      // Finalizar el documento
      doc.end();
    });
  }
}
