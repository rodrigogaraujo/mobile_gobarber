import { ValidationError } from "yup";

interface Erros {
    [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Erros {
    const validatinoErrors: Erros = {};

    err.inner.forEach((error) => {
        validatinoErrors[error.path] = error.message;
    });

    return validatinoErrors;
}
