import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findOneByCedulaNoRestrict(cedula: string) {
    const user = await this.userRepository.findOneBy({ identificacion: cedula });
    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }
    return user;
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.validateUser(id,updateUserDto);
    await this.userRepository.update({usuario_id: id}, updateUserDto);
    return {message: "Usuario actualizado"};
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

  async validateUser(id:number,user: UpdateUserDto){
    const userE = await this.userRepository.findOneBy({usuario_id: id});
    if (!userE) {
      throw new BadRequestException('El usuario no existe');
    }
    const userExists = await this.findOneByEmail(user.correo);
    if(userExists && userExists.usuario_id !== id){
        throw new BadRequestException('Ya existe un usuario con ese correo');
    }
    const userExistsPhone = await this.findOneByCellPhone(user.telefono);
    if(userExistsPhone && userExistsPhone.usuario_id !== id){
        throw new BadRequestException('Ya existe un usuario con ese número de teléfono');
    }
    const userExistsCedula = await this.findOneByCedula(user.identificacion);
    if(userExistsCedula && userExistsCedula.usuario_id !== id){
        throw new BadRequestException('Ya existe un usuario con esa cédula');
    }
    return user;
  }
}
