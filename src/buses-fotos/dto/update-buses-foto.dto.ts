import { PartialType } from '@nestjs/mapped-types';
import { CreateBusesFotoDto } from './create-buses-foto.dto';

export class UpdateBusesFotoDto extends PartialType(CreateBusesFotoDto) {}
