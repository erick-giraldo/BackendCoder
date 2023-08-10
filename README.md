# Proyecto Final BackEnd HarleyDavidson

Este es un servicio backend basado en un **ecommerce** que permite la consulta, creación, edición y eliminación de categorías, productos, pedidos y usuarios, permite realizar todo el proceso de compra desde agregar al carrito hasta generar la orden de compra.

## Deploy en Railway

[HarleyDavidson](https://backendcoder-production-7038.up.railway.app/)

## Requisitos básicos para ejecutar el proyecto

* Node.js
* Procesador de 64 bits
* Al menos 4 GB de RAM
* Espacio en disco mínimo de 100 MB para instalar las dependencias del proyecto y almacenar los datos necesarios
* Sistema operativo compatible con Node.js (Windows, macOS, Linux, etc.)

En caso no cuentes con Node.js puedes descargar la última versión directamente [aquí](https://nodejs.org/)

## Para descargar el proyecto

Clona el repositorio 
```sh
git clone https://github.com/erick-giraldo/BackendCoder.git
```
Instala dependencias node_modules
```sh
npm install
```
## Configuración inicial

Primero debemos crear un archivo en la raíz del proyecto con el nombre `.env` y copiar todo el contenido del archivo `.env.example`.
En este archivo se estarán manejando todas nuestras variables de entorno para nuestro proyecto, las cuales se especifican a continuación:

| VARIABLE                  | DESCRIPCIÓN                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `PORT`                    | Puerto en el que se ejecutará la aplicación, en este caso 8080 o puedes cambiarlo por         | cualquiera.                                                                                                                 |
| `NODE_ENV`                | Entorno de ejecución de la aplicación, en este caso "desarrollo".                             |
| `MONGODB_URI`             | URI de conexión a la base de datos Mongoose.                                                  |
| `GITHUB_CLIENT_ID`        | ID del cliente proporcionado por GitHub para autenticación OAuth.                             |
| `GITHUB_CLIENT_SECRET`    | SECRET del cliente proporcionado por GitHub para autenticación OAuth.                         |
| `GITHUB_CALLBACK`         | URL de devolución de llamada después de la autenticación con GitHub.                          |
| `JWT_SECRET`              | Clave secreta utilizada para la firma de tokens de autenticación em JWT.                      |
| `ADMIN_NAME`              | Nombre del administrador del sistema(para inicio de sesión).                                  |
| `ADMIN_EMAIL`             | Email del administrador del sistema(para inicio de sesión).                                   |
| `ADMIN_PASSWORD`          | Contraseña del administrador del sistema(para inicio de                                       |
| `EMAIL_USER`              | Correo electrónico utilizado para enviar correos electrónicos.                                |
| `EMAIL_PASS`              | Contraseña del correo electrónico utilizado para enviar correos electrónicos.                 |sesión).                                                                                                                    |
| `TWILIO_ACCOUNT_SID`      | Acoount ID para conectarse a Twilio que sera utilizado para el servicio de enviar correos electrónicos.                                                                                                               |
| `TWILIO_AUTH_TOKEN`       | Token para conectarse a Twilio que sera utilizado para el servicio de enviar correos 
electrónicos.
| `TWILIO_PHONE_NUMBER`     | Numero de telefono proporcionado por Twilio que sera utilizado para el servicio de enviar 
correos sms.
| `PERSISTENCE_TYPE`        | Tipo de persistencia de datos utilizado, en este caso "mongodb".                              |


## Para ejecutar el proyecto

Para ejecutar a nivel de desarrollo
```sh
npm run dev
```
Para ejecutar a nivel de producción
```sh
npm run start
```

Al inciar el proyecto por defecto se ejecutara en el puerto 8080

### Adicionales

* En la raíz del proyecto encontrarás el archivo `API-Sandi.postman_collection.json`, este te permitirá probar desde postman los endpoints del servicio.

