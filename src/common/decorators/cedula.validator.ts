import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isEcuadorianId', async: false })
export class IsEcuadorianIdConstraint implements ValidatorConstraintInterface {
    validate(identification: string, args: ValidationArguments) {
        // Verificar que tenga 10 dígitos
        if (!/^\d{10}$/.test(identification)) {
            return false;
        }

        // Obtener los dos primeros dígitos (provincia)
        const province = parseInt(identification.substring(0, 2));
        if (province < 1 || province > 24) {
            return false;
        }

        // Obtener el último dígito (verificador)
        const verifier = parseInt(identification.charAt(9));

        // Algoritmo de validación
        const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let sum = 0;

        // Calcular la suma según el algoritmo
        for (let i = 0; i < coefficients.length; i++) {
            let value = parseInt(identification.charAt(i)) * coefficients[i];
            if (value > 9) {
                value -= 9;
            }
            sum += value;
        }

        // Obtener el dígito verificador calculado
        const calculatedVerifier = (Math.ceil(sum / 10) * 10) - sum;
        
        // Comparar con el dígito verificador de la cédula
        return calculatedVerifier === verifier;
    }

    defaultMessage(args: ValidationArguments) {
        return 'La cédula ingresada no es válida';
    }
}

export function IsEcuadorianId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEcuadorianId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsEcuadorianIdConstraint,
        });
    };
}