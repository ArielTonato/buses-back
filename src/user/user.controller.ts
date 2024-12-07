import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';

// @Auth(Roles.ADMINISTRADORES)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get('search/:name')
  findOneByNameOrLastName(@Param('name') name: string) {
    return this.userService.findOneByNameOrLastName(name);
  }

  @Get('cedula/:cedula')
  findOneByCedula(@Param('cedula') cedula: string) {
    return this.userService.findOneByCedulaNoRestrict(cedula);
  }


  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
