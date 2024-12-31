import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfGeneratorService {
  async generateTicket(ticketData: {
    cooperativa: string;
    direccion: string;
    ruc: string;
    fechaViaje: string;
    horaViaje: string;
    asientos: string[];
    numeroAutobus: string;
    tipoPago: string;
    identificacionUsuario: string;
    nombreUsuario: string;
    destino: string;
    cantidad: number;
    precioUnitario: number;
  }): Promise<Buffer> {
    // Create a new PDF document
    const doc = new PDFDocument({
      size: [283.46, 566.93], // 7.5cm x 15cm in points (1 inch = 72 points)
      margins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    });

    // Create a buffer to store the PDF
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    // Return a promise that resolves with the PDF buffer
    return new Promise(async (resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      try {
        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(JSON.stringify({
          cooperativa: ticketData.cooperativa,
          fecha: ticketData.fechaViaje,
          asientos: ticketData.asientos,
          autobus: ticketData.numeroAutobus,
        }));

        // Set font and size
        doc.font('Helvetica-Bold').fontSize(12);
        
        // Cooperativa name
        doc.text(ticketData.cooperativa, { align: 'center' });
        
        // Address and RUC
        doc.font('Helvetica').fontSize(8);
        doc.text(ticketData.direccion, { align: 'center' });
        doc.text(`RUC: ${ticketData.ruc}`, { align: 'center' });
        
        // Add QR code
        doc.image(qrCodeData, doc.page.width / 2 - 40, doc.y + 10, {
          width: 80,
          height: 80,
        });
        
        doc.moveDown(4);
        
        // Travel details
        doc.fontSize(10);
        doc.text(`Fecha: ${ticketData.fechaViaje}`, { continued: true });
        doc.text(`    Hora: ${ticketData.horaViaje}`, { align: 'right' });
        doc.text(`Asiento(s): ${ticketData.asientos.join(', ')}`, { continued: true });
        doc.text(`    Bus: ${ticketData.numeroAutobus}`, { align: 'right' });
        
        // Customer details
        doc.moveDown();
        doc.text(`Cliente: ${ticketData.nombreUsuario}`);
        doc.text(`ID: ${ticketData.identificacionUsuario}`);
        doc.text(`Destino: ${ticketData.destino}`);
        doc.text(`Forma de pago: ${ticketData.tipoPago}`);
        
        // Table header
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(8);
        doc.text('Cant.', 20, doc.y, { width: 40 });
        doc.text('Descripción', 60, doc.y - 10, { width: 120 });
        doc.text('P. Unit', 180, doc.y - 10, { width: 40 });
        doc.text('Total', 220, doc.y - 10, { width: 40 });
        
        // Table content
        doc.font('Helvetica').fontSize(8);
        doc.text(ticketData.cantidad.toString(), 20, doc.y + 5, { width: 40 });
        doc.text('BOLETO', 60, doc.y - 10, { width: 120 });
        doc.text(ticketData.precioUnitario.toFixed(2), 180, doc.y - 10, { width: 40 });
        doc.text((ticketData.cantidad * ticketData.precioUnitario).toFixed(2), 220, doc.y - 10, { width: 40 });
        
        // Totals
        doc.moveDown(2);
        doc.text(`Subtotal: $${(ticketData.cantidad * ticketData.precioUnitario).toFixed(2)}`, { align: 'right' });
        doc.text(`IVA: $0.00`, { align: 'right' });
        doc.text(`Total: $${(ticketData.cantidad * ticketData.precioUnitario).toFixed(2)}`, { align: 'right' });

        // Finalize the PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
