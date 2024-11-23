import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Roles } from 'src/common/enums/roles.enum';
import { IsEnum } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    //Aqui si va el rol
    @IsEnum(Roles)
    rol: Roles;
}
