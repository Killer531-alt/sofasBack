# Orlando Ortiz Muebles Backend API

Node.js + Express backend for CRUD operations on:
- Solicitar Cotización de Refacción
- Diseño desde Cero (Cita)
- Solicitud de Personalización

## Setup

1. Instala dependencias:
   ```
npm install
   ```
2. Crea un archivo `.env` (ya incluido) con tu URI de MongoDB y puerto:
   ```
MONGODB_URI=mongodb+srv://paualejaortiz2018_db_user:2EjZyM4AiziNPOkq@pau.7oejrs0.mongodb.net/?retryWrites=true&w=majority&appName=pau
PORT=4000
   ```
3. Inicia el servidor:
   ```
npm run dev
   ```

## Endpoints

### Refacción
- `POST   /api/refaccion`   (crear)
- `GET    /api/refaccion`   (listar todos)
- `GET    /api/refaccion/:id` (obtener uno)
- `PUT    /api/refaccion/:id` (actualizar)
- `DELETE /api/refaccion/:id` (eliminar)

### Cita
- `POST   /api/cita`
- `GET    /api/cita`
- `GET    /api/cita/:id`
- `PUT    /api/cita/:id`
- `DELETE /api/cita/:id`

### Personalización
- `POST   /api/personalizacion`
- `GET    /api/personalizacion`
- `GET    /api/personalizacion/:id`
- `PUT    /api/personalizacion/:id`
- `DELETE /api/personalizacion/:id`

## Notas
- Todos los endpoints aceptan y devuelven JSON.
- Para archivos (como imágenes), se recomienda almacenar solo la ruta o usar base64 (ajustar modelo si es necesario).
- El backend está listo para conectar con tu frontend.
