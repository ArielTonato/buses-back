import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsAEcuadorianLicensePlate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEcuadorianLicensePlate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;
                    const placaRegex = /^[A-Z]{3}-\d{3,4}$/;
                    
                    return placaRegex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'La placa debe tener formato ecuatoriano válido (XXX-1234 o XXX-123)';
                }
            }
        });
    };
}