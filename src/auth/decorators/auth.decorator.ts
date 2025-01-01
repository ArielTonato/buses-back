import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesDecorator } from "src/common/decorators/roles.decorator";
import { Roles } from "src/common/enums/roles.enum";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(rol:Roles){
    return applyDecorators(
        RolesDecorator(rol),
        UseGuards(AuthGuard, RolesGuard)
    );
}