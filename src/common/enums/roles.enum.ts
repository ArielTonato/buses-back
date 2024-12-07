export enum Roles {
    ADMINISTRADORES = 'administrador',
    USUARIOS_BUSES = 'usuario_bus', //Son los que se encargan de la gestión de los buses
    OFICINISTAS = 'oficinista', //Son los que se encargan de la gestión de la venta de boletos
    USUARIOS_APROBADORES = 'usuario_aprobadore', // Son los que se encargan de aprobar las frecuencias
    USUARIOS_NORMAL = 'usuario_normal', // Son los que se encargan de comprar los boletos
    USUARIO_CONDUCTOR = 'usuario_conductor'
}