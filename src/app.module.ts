import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BusesModule } from './buses/buses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { BusesFotosModule } from './buses-fotos/buses-fotos.module';

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
    BusesFotosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
