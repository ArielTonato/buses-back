import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/common/decorators/roles.decorator";
import { Roles } from "src/common/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector
    ){}
    canActivate(context: ExecutionContext): boolean  {
        const rol = this.reflector.getAllAndOverride<Roles>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);

        if(!rol){
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        if(user.rol === Roles.ADMINISTRADORES){
            return true;
        }
        if(user.rol !== rol){
            throw new ForbiddenException("No tienes permisos para realizar esta acción");
        }
        return true;
    }
}