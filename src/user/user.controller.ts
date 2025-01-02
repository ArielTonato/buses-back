import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuarios')
// @Auth(Roles.ADMINISTRADORES)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: CreateUserDto
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios',
    type: [CreateUserDto]
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar usuario por nombre o apellido' })
  @ApiParam({ name: 'name', description: 'Nombre o apellido a buscar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios encontrados',
    type: [CreateUserDto]
  })
  @Get('search/:name')
  findOneByNameOrLastName(@Param('name') name: string) {
    return this.userService.findOneByNameOrLastName(name);
  }

  @ApiOperation({ summary: 'Buscar usuario por cédula' })
  @ApiParam({ name: 'cedula', description: 'Número de cédula' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get('cedula/:cedula')
  findOneByCedula(@Param('cedula') cedula: string) {
    return this.userService.findOneByCedulaNoRestrict(cedula);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a actualizar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: UpdateUserDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
