import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
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

        console.log(rol);
        if(!rol){
            return true;
        }
        const user = context.switchToHttp().getRequest();
        console.log(user);
        if(user.rol === Roles.ADMINISTRADORES){
            return true;
        }

        return rol === user.rol;
    }
}