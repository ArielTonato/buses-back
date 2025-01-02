import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Roles } from 'src/common/enums/roles.enum';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'Rol del usuario',
        enum: Roles,
        example: Roles.USUARIOS_NORMAL
    })
    @IsEnum(Roles)
    rol: Roles;
}
