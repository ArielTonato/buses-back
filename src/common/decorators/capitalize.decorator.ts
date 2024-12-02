import { Transform } from "class-transformer";

export function Capitalize() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            // Aplica trim y luego capitaliza
            const trimmed = value.trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        }
        return value;
    });
}
