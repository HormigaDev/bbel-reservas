# API de Autenticación de Usuarios

Esta documentación describe los endpoints disponibles en el módulo de autenticación de usuarios, que incluye el inicio de sesión, registro y cambio de contraseña.

---

## Endpoints

### Iniciar sesión

-   **URL**: `/auth/login`
-   **Método**: `POST`
-   **Descripción**: Autentica a un usuario utilizando sus credenciales (email y contraseña) y retorna un token de acceso.
-   **Código de respuesta**: `200 OK`
-   **Requiere autenticación**: No
-   **Requiere rol de Admin**: No
-   **Parámetros del cuerpo**:
    ```ts
    {
        "email": string,
        "password": string
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "token": string
    }
    ```

---

### Registrar un nuevo usuario

-   **URL**: `/auth/register`
-   **Método**: `POST`
-   **Descripción**: Crea un nuevo usuario en el sistema. El endpoint valida que el email y la contraseña sean válidos. Retorna el token de autenticación junto con la información del usuario creado.
-   **Código de respuesta**: `201 Created`
-   **Requiere autenticación**: No
-   **Requiere rol de Admin**: No
-   **Parámetros del cuerpo**:
    ```ts
    {
        "name": string,
        "email": string,
        "phone": string,
        "password": string,
    }
    ```
-   **Respuesta**:
    ```ts
    {
        "token": string,
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

---

### Cambiar contraseña del usuario autenticado

-   **URL**: `/auth/change-password/`
-   **Método**: `PATCH`
-   **Descripción**: Permite al usuario autenticado cambiar su contraseña. La contraseña actual debe coincidir y la nueva contraseña debe cumplir con los requisitos de seguridad.
-   **Código de respuesta**: `204 No Content`
-   **Requiere autenticación**: Sí
-   **Requiere rol de Admin**: No
-   **Parámetros del cuerpo**:
    ```ts
    {
        "prevPassword": string,
        "newPassword": string
    }
    ```
-   **Respuesta**: Ninguna.

---

## Errores comunes

-   **400 Bad Request**: Parámetros de entrada inválidos. Esto incluye contraseñas que no cumplen con el formato requerido o correos electrónicos mal formados.
-   **401 Unauthorized**: El token de acceso no es válido o está expirado.
-   **404 Not Found**: El usuario no existe en el sistema.
-   **409 Conflict**: Ya existe un usuario registrado con el correo electrónico especificado en el caso de registro de usuario.

---

## Notas

-   La autenticación de la aplicación utiliza tokens JWT. Asegúrese de incluir el token en las solicitudes autenticadas.
-   El token de autenticación tiene una validez de 2 horas.
