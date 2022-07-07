import { SpeilError } from '@utils/error';

export class FetchError extends SpeilError {
    constructor(message?: string) {
        super(message ?? 'Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler.');
        this.severity = 'error';
    }
}

export class NotFoundError extends FetchError {
    constructor() {
        super('Personen har ingen perioder til godkjenning eller tidligere utbetalinger i Speil');
        this.severity = 'info';
    }
}

export class ProtectedError extends FetchError {
    constructor() {
        super('Du har ikke tilgang til å søke opp denne personen');
        this.severity = 'info';
    }
}

export const isFetchErrorArray = (errors: any): errors is Array<FetchError> => {
    return (
        Array.isArray(errors) &&
        errors.length > 0 &&
        errors.every((it) => it instanceof FetchError || it instanceof NotFoundError || it instanceof ProtectedError)
    );
};