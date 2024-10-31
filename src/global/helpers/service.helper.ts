import { BadRequestException } from '@nestjs/common';

/**
 * 1 minúscula
 * 1 mayúscula
 * 1 número
 * 1 caracter especial
 * 8 digitos como mínimo
 */
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/**
 * texto antes del @ con un mínimo de 6 caracteres pudiendo incluir puntos.
 * una @ obligatorio
 * un texto de al menos 3 digitos alfabeticos en minusculas
 * un punto literal (opcional)
 * un mínimo de 2 digitos numéricos
 */
export const EmailRegex = /^[a-z0-9._%+-]{6,}@[a-z0-9.-]+\.[a-z]{2,}$/;

/**
 * Nombre con unicamente caracteres alfabéticos y espacios en blanco
 */
export const NameRegex = /^[a-zA-Z\s]{2,}$/;

/**
 * Una cadena de números con un mínimo de 11 y máximo 15
 */
export const PhoneRegex = /^[0-9]{11,15}$/;

/**
 * Permite años entre 1900 y 2099
 * Permite meses entre 01 y 12
 * Permite días entre 01 y 31
 */
export const DateRegex =
    /^(?:19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * Permite horas entre 00 y 23
 * Permite minutos entre 00 y 59
 * Permite segundos entre 00 y 59
 */
export const TimeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

/**
 * Los límites de consulta para métodos que devuelvan muchos resultados
 */
export const QueryLimits = [10, 20, 30, 50, 100];

/**
 * devuelve un objeto solo con las propiedades no nulas o indefinidas para no subcribirlos en
 * la base de datos
 * @param dto - el Data Object Transfer que contiene los campos a verificar
 * @returns {Partial<T>} - Devuelve un objeto solo con las propiedades que se van a actualizar
 */
export function filterNonNullableProps<T>(dto: T): Partial<T> {
    const props: Partial<T> = {};
    Object.entries(dto).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            props[key] = value;
        }
    });

    return props;
}

/**
 * Valida si el limite informado es uno de los valores admitidos en QueryLimits.
 * Si es admitido devuelve el mismo límite, si no lo es lanza un error http 400 BadRequest
 * @param limit - El límite a verificar
 * @returns {number} - el número si es el límite
 * @throws {BadRequestException}
 */
export function validateLimit(limit: number): number {
    if (QueryLimits.includes(limit)) {
        return limit;
    } else {
        throw new BadRequestException(
            `El límite informado no es válido. Los límites aceptados son: ${QueryLimits.join(', ')}.`,
        );
    }
}
