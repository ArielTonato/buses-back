import { Module } from '@nestjs/common';
import { CooperativaService } from './cooperativa.service';
import { CooperativaController } from './cooperativa.controller';

@Module({
  controllers: [CooperativaController],
  providers: [CooperativaService],
})
export class CooperativaModule {}
