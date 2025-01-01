import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './entities/asiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asiento])
  ],
  controllers: [],
  providers: [],
})
export class AsientosModule {}
