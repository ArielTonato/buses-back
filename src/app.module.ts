import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BusesModule } from './buses/buses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { BusesFotosModule } from './buses-fotos/buses-fotos.module';
import { AsientosModule } from './asientos/asientos.module';
import { RouterModule } from '@angular/router';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, //Poner el puerto de su base de datos
      username: 'root',
      password: '',
      database: 'bd_buses', //Nombrar su base de esta manera
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    BusesModule,
    CloudinaryModule,
    BusesFotosModule,
    AsientosModule,
    RouterModule.forRoot([]), // Add your routes here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
