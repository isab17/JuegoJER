# Funcionalidades con API REST
Este archivo describe los detalles de la API REST del proyecto.

---

### POST http://localhost:8080/api/users
Crea un nuevo usuario con credenciales de acceso.

```json
{
  "username": "ShadowHunter",
  "password": "hunter2024"
}
```

---

### POST http://localhost:8080/api/users/login
Autentica a un usuario mediante su nombre de usuario y contraseña.
```json
{
  "username": "ShadowHunter",
  "password": "hunter2024"
}
```

---

### PUT http://localhost:8080/api/users/ShadowHunter
Actualiza el registro del usuario con nombre incluyendo información de usuarios.

```json
{
  "id": 1,
  "username": "ShadowHunter",
  "password": "c1g4l4s",
  "score": "12"
  
}
```

---

### GET http://localhost:8080/api/users/ShadowHunter
Devuelve el usuario a partir del nombre.

---

### DELETE http://localhost:8080/api/users/ShadowHunter/c1g4l4s
Elimina el usuario a partir del nombre y la contraseña.

---


