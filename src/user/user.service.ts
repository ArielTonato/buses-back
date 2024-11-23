import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ correo: email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { correo: email },
      select: ['usuario_id','correo', 'password', "primer_nombre", "primer_apellido", "rol"]
    })
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({usuario_id: id});
  }

  findOneByCellPhone(phone: string) {
    return this.userRepository.findOneBy({ telefono: phone });
  }

  findOneByCedula(cedula: string) {
    return this.userRepository.findOneBy({ identificacion: cedula });
  }

  findOneByNameOrLastName(name: string) {
    return this.userRepository.find({
      where: [
        { primer_nombre: Like(`%${name}%`) },
        { segundo_nombre: Like(`%${name}%`) },
        { primer_apellido: Like(`%${name}%`) },
        { segundo_apellido: Like(`%${name}%`) }
      ]
    });
}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({usuario_id: id});
    if (!user) {
      return {message: "El usuario no existe"};
    }
    //Nota: Cambiar a soft delete si se desea mantener el registro en la base de datos
    await this.userRepository.delete({usuario_id: id});
    return {message: "Usuario eliminado"};
  }
}
