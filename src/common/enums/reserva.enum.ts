export enum EstadoReserva {
    PENDIENTE = 'pendiente',
    CONFIRMADA = 'confirmada',
    CANCELADA = 'cancelada'
}

export enum MetodoPago {
    PRESENCIAL = 'presencial',
    PAYPAL = 'paypal',
    DEPOSITO = 'deposito', //Deposito bancario tambien hace referencia a una transferencia bancaria
}