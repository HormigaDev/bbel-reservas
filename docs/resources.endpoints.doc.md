# API de Recursos

Esta documentación describe los endpoints disponibles en el módulo de recursos, que permite crear, buscar, listar, actualizar y eliminar recursos.

---

## Endpoints

### Listar todos los recursos

-   **URL**: `/resources/all`
-   **Método**: `GET`
-   **Descripción**: Recupera todos los recursos de acuerdo con los parámetros de paginación.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros de consulta**:
    ```ts
    {
        "limit": number; // Límite de recursos por página
        "page": number; // Número de la página
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "resources": [
            {
                "id": number,
                "name": string,
                "description": string,
                "price": number
            }
            ...
        ],
        "count": number
    }
    ```

---

### Buscar recursos

-   **URL**: `/resources/search`
-   **Método**: `GET`
-   **Descripción**: Permite buscar recursos por un criterio de texto en el nombre o descripción de los recursos.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de consulta**:
    ```ts
    {
        "limit": number; // Límite de recursos por página
        "page": number; // Número de la página
        "text": string; // Criterio de busqueda
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "resources": [
            {
                "id": number,
                "name": string,
                "description": string,
                "price": number
            }
            ...
        ],
        "count": number
    }
    ```

---

### Crear un recurso

-   **URL**: `/resources/create`
-   **Método**: `POST`
-   **Descripción**: Permite registrar un nuevo recurso en el sistema. Solo los usuarios con rol de administrador pueden acceder.
-   **Código de respuesta**: `201 Created`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros del cuerpo**:
    ```ts
    {
        "name": string,
        "description": string,
        "price": number
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "resource": {
            "id": number,
            "name": string,
            "description": string,
            "price": number
        }
    }
    ```

---

### Actualizar un recurso

-   **URL**: `/resources/update/:id`
-   **Método**: `PUT`
-   **Descripción**: Permite actualizar las propiedades de un recurso existente. Requiere rol de administrador. Se debe proporcionar al menos un campo para la actualización.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de ruta**:
    -   `id`: (obligatorio, número): ID del recurso a actualizar
-   **Parámetros del cuerpo**:
    ```ts
    {
        "name"?: string,
        "description"?: string,
        "price"?: string,
    }
    ```
-   **Respuesta**: Ninguna.

---

### Eliminar un recurso

-   **URL**: `/resources/:id`
-   **Método**: `DELETE`
-   **Descripción**: Elimina un recurso existente del sistema. Requiere rol de administrador.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: Sí
-   **Parámetros de ruta**:
    -   `id` (obligatorio, número): ID del recurso a eliminar
-   **Respuesta**: Ninguna.

---

## Errores comunes

-   **400 Bad Request**: Parámetros de entrada inválidos o campos faltantes.
-   **401 Unauthorized**: El usuario no tiene autorización para realizar la acción.
-   **404 Not Found**: El recurso solicitado no existe.
-   **409 Conflict**: El recurso ya existe, por ejemplo, si se intenta registrar un recurso con un nombre duplicado.

---

## Notas

-   Los usuarios deben tener un token de autenticación con permisos de administrador para acceder a los endpoints de creación, actualización y eliminación de recursos.
-   Los parámetros de paginación ayudan a optimizar el rendimiento al permitir recuperar recursos en lotes más pequeños.
