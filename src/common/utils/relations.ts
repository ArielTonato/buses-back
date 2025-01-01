export const defaultRelations = {
    conductor: true,
    bus: {
        fotos: true,
        asientos: true
    },
    rutas: {
        parada: true,
    },
};

export const defaultOrder = {
    rutas: {
        orden: 'ASC',
    },
};