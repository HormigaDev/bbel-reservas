[../](../README.md)

# API de Gestión de Usuarios

Este documento describe los endpoints disponibles para la gestión de usuarios en el sistema.

## Autenticación y Autorización

Para algunos endpoints, es necesario estar autenticado y contar con roles específicos como `Admin`. El acceso a estos endpoints se controla mediante el uso de un guard llamado `AdminGuard`.

---

## Endpoints

### Obtener información de usuario actual

-   **URL**: `/users`
-   **Método**: `GET`
-   **Descripción**: Retorna la información del usuario que ha iniciado sesión.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Parámetros de consulta**: Ninguno
-   **Respuesta**:
    ```ts
    {
        "user": {
            "id": number,
            "name": string,
            "email": string,
            "phone": string,
            "role": string,
            "createdAt": string,
        }
    }
    ```

### Obtener lista de todos los usuarios (requiere rol de Admin)

-   **URL**: `/users/all`
-   **Método**: `GET`
-   **Descripción**: Retorna una lista de usuarios paginada, junto con el conteo total de usuarios en el sistema.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de consulta**:
    ```ts
    {
        "limit": number, // Límite de resultados por página
        "page": number, // Página para visualizar los resultados (paginación)
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "users": [
            {
                "id": number,
                "name": string,
                "email": string,
                "phone": string,
                "role": string,
                "createdAt": string,
            }
            ...
        ],
        "count": number
    }
    ```

### Buscar usuarios (requiere rol de Admin)

-   **URL**: `/users/search`
-   **Método**: `GET`
-   **Descripción**: Busca usuarios en el sistema mediante un texto de consulta. Puede filtrar por nombre o email.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de consulta**:
    ```ts
    {
        "limit": number, // Límite de resultados por página
        "page": number, // Página para visualizar los resultados (paginación)
        "text": string, // texto con el critério de busqueda
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "users": [
            {
                "id": number,
                "name": string,
                "email": string,
                "phone": string,
                "role": string,
                "createdAt": string,
            }
            ...
        ],
        "count": number
    }
    ```

### Actualizar usuario actual

-   **URL**: `/users`
-   **Método**: `PUT`
-   **Descripción**: Permite al usuario autenticado actualizar su información.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros de cuerpo**:
    ```ts
    {
        "name"?: string,
        "email"?: string,
        "phone"?: string,
    }
    ```
-   **Respuesta**: Ninguna.

### Eliminar un usuario (requiere rol de Admin)

-   **URL**: `/users/:id`
-   **Método**: `DELETE`
-   **Descripción**: Elimina el usuario con el ID especificado.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de ruta**:
    -   `id` (obligatorio, número): ID del usuario a eliminar.
-   **Respuesta**: Ninguna.

---

## Errores comunes

-   **400 Bad Request**: El request contiene parámetros o datos inválidos.
-   **401 Unauthorized**: El usuario no está autenticado.
-   **403 Forbidden**: El usuario no tiene permisos para acceder al recurso.
-   **404 Not Found**: No se ha encontrado el recurso solicitado.
-   **409 Conflict**: Un usuario ya existe con el email proporcionado en el caso de creación o actualización de usuarios.

---

## Notas

-   Todos los endpoints devuelven errores específicos con mensajes detallados para ayudar a los desarrolladores a entender el motivo del fallo.
-   La paginación está implementada en los endpoints que retornan listas de usuarios. Use `limit` y `page` para controlar el número de resultados y la página específica.
