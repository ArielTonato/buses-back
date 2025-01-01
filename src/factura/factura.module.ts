import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { PdfGeneratorService } from '../utils/pdf-generator.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { Cooperativa } from '../cooperativa/entities/cooperativa.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factura, Reserva, Boleto, Cooperativa, User]),
    CloudinaryModule
  ],
  controllers: [FacturaController],
  providers: [FacturaService, PdfGeneratorService, CloudinaryService],
  exports: [FacturaService]
})
export class FacturaModule {}
