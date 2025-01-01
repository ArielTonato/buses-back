import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BusesModule } from './buses/buses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { BusesFotosModule } from './buses-fotos/buses-fotos.module';
import { AsientosModule } from './asientos/asientos.module';
import { FrecuenciasModule } from './frecuencias/frecuencias.module';
import { ParadasModule } from './paradas/paradas.module';
import { RutasModule } from './rutas/rutas.module';
import { ComprobantesPagosModule } from './comprobantes_pagos/comprobantes_pagos.module';
import { BoletosModule } from './boletos/boletos.module';
import { ReservaModule } from './reserva/reserva.module';
import { MailModule } from './mail/mail.module';
import { CooperativaModule } from './cooperativa/cooperativa.module';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5432, //Poner el puerto de su base de datos
      username:"root",
      password:"12345",
      database:"bd_buses",//Nombrar su base de esta manera
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        
      }
    ),
    UserModule,
    AuthModule,
    BusesModule,
    CloudinaryModule,
    BusesFotosModule,
    AsientosModule,
    FrecuenciasModule,
    ParadasModule,
    RutasModule,
    ComprobantesPagosModule,
    BoletosModule,
    ReservaModule,
    MailModule,
    CooperativaModule,
    FacturaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
