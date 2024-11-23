import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enums/roles.enum";


export const ROLES_KEY = 'roles';
export const RolesDecorator = (rol:Roles) => SetMetadata(ROLES_KEY, rol);