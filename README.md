# Entrega Final – Backend III

API REST para la gestión de **usuarios, mascotas y adopciones**, documentada con Swagger y lista para ejecutarse con Docker.

## Imagen en Docker Hub

**Enlace público:** https://hub.docker.com/r/crdobert/entrega-final

La imagen está publicada y se puede descargar directamente:

```bash
docker pull crdobert/entrega-final:latest
```

## Construir la imagen

Desde la carpeta raíz del proyecto (donde está el `Dockerfile`):

```bash
docker build -t crdobert/entrega-final:latest .
```

```bash
docker images crdobert/entrega-final
```

Debe aparecer una fila con repositorio `crdobert/entrega-final` y tag `latest`.

## Ejecutar el contenedor

```bash
docker run -d --name entrega-final ^
  -p 8080:8080 ^
  -e PORT=8080 ^
  -e MONGODB_URI=mongodb://host.docker.internal:27017/coderhouse ^
  -e JWT_SECRET=cambia-este-secreto ^
  crdobert/entrega-final:latest
```


Para ver los logs y detener el contenedor:

```bash
docker logs -f entrega-final
docker stop entrega-final
docker rm entrega-final
```

### Ejecutar con Docker Compose (API + MongoDB)


```bash
docker compose up -d --build
docker compose logs -f api
```

Para detener y limpiar:

```bash
docker compose down
```

La API queda disponible en `http://localhost:8080`.

## Acceder y utilizar el proyecto

Una vez levantado el contenedor:
| Recurso | URL |
| --- | --- |
| API | <http://localhost:8080> |
| Swagger UI (documentación de Users) | <http://localhost:8080/api/docs/> |
| Especificación OpenAPI (JSON) | <http://localhost:8080/api/docs.json> |
| Prueba de logging | <http://localhost:8080/loggerTest> |


| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/users` | Listar usuarios |
| `GET` | `/api/users/:uid` | Obtener un usuario |
| `PUT` | `/api/users/:uid` | Actualizar un usuario |
| `DELETE` | `/api/users/:uid` | Eliminar un usuario |
| `GET` | `/api/pets` | Listar mascotas |
| `POST` | `/api/pets` | Crear mascota |
| `PUT` | `/api/pets/:pid` | Actualizar mascota |
| `DELETE` | `/api/pets/:pid` | Eliminar mascota |
| `GET` | `/api/adoptions` | Listar adopciones |
| `GET` | `/api/adoptions/:aid` | Obtener una adopción |
| `POST` | `/api/adoptions/:uid/:pid` | Adoptar una mascota |
| `POST` | `/api/sessions/register` | Registrar usuario |
| `POST` | `/api/sessions/login` | Iniciar sesión |

## Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto HTTP del contenedor | `8080` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | vacía (sin conexión) |
| `JWT_SECRET` | Secreto para firmar tokens | `tokenSecretJWT` |

Si `MONGODB_URI` no está definida, el servidor arranca igual y se puede consultar Swagger, pero las rutas que usan base de datos no responderan correctamente.

https://hub.docker.com/r/crdobert/entrega-final 
