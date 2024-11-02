[../](../README.md)

# API de Gestión de Reservas

Este documento describe los endpoints disponibles para la gestión de reservas en el sistema.

## Autenticación y Autorización

Para algunos endpoints, es necesario estar autenticado y contar con roles específicos como `Admin`. El acceso a estos endpoints se controla mediante el uso de un guard llamado `AdminGuard`.

---

## Endpoints

### Obtener reservas

-   **URL**: `/reservations`
-   **Método**: `GET`
-   **Descripción**: Retorna una lista de reservas dentro de un rango de fechas y horas especificado.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros de consulta**:
    -   `startDate` (obligatorio, string): Fecha de inicio en formato `YYYY-MM-DD`.
    -   `endDate` (obligatorio, string): Fecha de fin en formato `YYYY-MM-DD`.
    -   `startTime` (obligatorio, string): Hora de inicio en formato `HH:MM:SS`.
    -   `endTime` (obligatorio, string): Hora de fin en formato `HH:MM:SS`.
    -   `limit` (opcional, número): Número máximo de reservas por página.
    -   `page` (opcional, número): Número de página para paginación.
-   **Respuesta**:
    ```ts
    {
        "reservations": [
            {
                "id": number,
                "reservationDate": string,
                "startTime": string,
                "endTime": string,
                "status": string,
                "createdAt": string,
                "userId": number,
                "resourceId": number,
            }
            ...
        ],
        "count": number
    }
    ```

### Obtener todas las reservas

-   **URL**: `/reservations/all`
-   **Método**: `GET`
-   **Descripción**: Retorna todas las reservas, sin aplicar filtros de fecha o hora. Requiere permisos administrativos.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de consulta**:
    -   `limit` (opcional, número): Número máximo de reservas por página.
    -   `page` (opcional, número): Número de página para paginación.
-   **Respuesta**:
    ```ts
    {
        "reservations": [
            {
                "id": number,
                "reservationDate": string,
                "startTime": string,
                "endTime": string,
                "status": string,
                "createdAt": string,
                "userId": number,
                "resourceId": number,
            }
            ...
        ],
        "count": number
    }
    ```

### Registrar una reserva

-   **URL**: `/reservations/reserve`
-   **Método**: `POST`
-   **Descripción**: Crea una nueva reserva para un usuario autenticado.
-   **Código de respuesta**: `201 Created`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros de cuerpo**:
    ```ts
    {
        "resourceId": number,
        "reservationDate": string,
        "startTime": string,
        "endTime": string
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "reservation": {
            "id": number,
            "userId": number,
            "resourceId": number,
            "reservationDate": string,
            "startTime": string,
            "endTime": string,
            "status": string,
            "createdAt": string
        }
    }
    ```

### Actualizar una reserva

-   **URL**: `/reservations`
-   **Método**: `PUT`
-   **Descripción**: Actualiza una reserva existente para el usuario autenticado.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros de cuerpo**:
    ```ts
    {
        "reservationDate"?: string,
        "startTime"?: string,
        "endTime"?: string,
        "status"?: string
    }
    ```
-   **Respuesta**: Ninguna.

### Actualizar el estado de una reserva

-   **URL**: `/reservations/status/:id/:status`
-   **Método**: `PATCH`
-   **Descripción**: Actualiza el estado de una reserva específica. Requiere permisos administrativos.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de ruta**:
    -   `id` (obligatorio, número): ID de la reserva a actualizar.
    -   `status` (obligatorio, string): Nuevo estado de la reserva.
-   **Respuesta**: Ninguna.

### Eliminar una reserva

-   **URL**: `/reservations/:id`
-   **Método**: `DELETE`
-   **Descripción**: Elimina la reserva con el ID especificado.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de ruta**:
    -   `id` (obligatorio, número): ID de la reserva a eliminar.
-   **Respuesta**: Ninguna.

---

## Errores comunes

-   **400 Bad Request**: El request contiene parámetros o datos inválidos.
-   **401 Unauthorized**: El usuario no está autenticado.
-   **403 Forbidden**: El usuario no tiene permisos para acceder al recurso.
-   **404 Not Found**: No se ha encontrado el recurso solicitado.
-   **409 Conflict**: El recurso ya está reservado para la fecha y hora especificadas.

---

## Notas

-   Todos los endpoints devuelven errores específicos con mensajes detallados para ayudar a los desarrolladores a entender el motivo del fallo.
-   La paginación está implementada en los endpoints que retornan listas de reservas. Use `limit` y `page` para controlar el número de resultados y la página específica.
