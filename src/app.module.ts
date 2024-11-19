import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';


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
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
