# API de Frases

## Instalación

```bash
npm install
cp .env.example .env   # Edita con tus credenciales de MySQL
npm run dev
```

## Endpoints

### Auth (públicos)
| Método | Ruta            | Descripción         |
|--------|-----------------|---------------------|
| POST   | /auth/register  | Registrar usuario   |
| POST   | /auth/login     | Iniciar sesión      |

### Frases
| Método | Ruta            | Auth | Descripción                        |
|--------|-----------------|------|------------------------------------|
| GET    | /frases         | No   | Listar todas (o ?tipo=motivacional)|
| GET    | /frases/random  | No   | Frase aleatoria (o ?tipo=...)      |
| GET    | /frases/:id     | No   | Una frase por ID                   |
| POST   | /frases         | Sí   | Crear frase                        |
| PUT    | /frases/:id     | Sí   | Editar frase (dueño o admin)       |
| DELETE | /frases/:id     | Sí   | Eliminar frase (dueño o admin)     |

## Ejemplos Postman

### Registro
POST /auth/register
```json
{ "nombre": "Berny", "email": "berny@email.com", "password": "123456" }
```

### Login
POST /auth/login
```json
{ "email": "berny@email.com", "password": "123456" }
```
→ Devuelve un `token`. Úsalo en todas las rutas protegidas:
`Authorization: Bearer <token>`

### Crear frase
POST /frases  (con token)
```json
{ "texto": "El éxito es la suma de pequeños esfuerzos.", "tipo": "motivacional" }
```

### Frase aleatoria por tipo
GET /frases/random?tipo=motivacional

## Control de acceso
- **user**: solo puede editar/eliminar sus propias frases.
- **admin**: puede editar/eliminar cualquier frase.

Para crear un admin, cambia manualmente el campo `rol` en la base de datos.
