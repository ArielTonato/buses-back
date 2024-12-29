export enum MetodoPago {
    PRESENCIAL = 'presencial',
    PAYPAL = 'paypal',
    DEPOSITO = 'deposito', //Deposito bancario tambien hace referencia a una transferencia bancaria
}

export enum EstadoBoleto {
    PENDIENTE = 'pendiente',
    PAGADO = 'pagado',
    CANCELADO = 'cancelado'
}