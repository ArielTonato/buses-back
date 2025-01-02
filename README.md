# Sistema de Reserva de Buses

Este proyecto es un sistema de reserva de pasajes de bus desarrollado con NestJS. El sistema permite a los usuarios realizar reservas de asientos y gestionar pagos para una cooperativa de transporte específica.

## Características Principales 

- Autenticación de usuarios
- Gestión de usuarios
- Gestión de buses, frecuencias, rutas y paradas
- Reserva de asientos
- Sistema de pagos con múltiples métodos (PayPal, Depósito, Presencial)
- Carga de imagenes de buses, y comprobantes de pago
- Generación de boletos y facturas, ademas de códigos QR
- Envio de emails de reserva y cancelación
- Documentación API con Swagger

## Pre-requisitos 

- Node.js (v20 o superior)
- NestJS
- MySQL
- pnpm

### Instalación de pnpm

Si no tienes pnpm instalado, puedes instalarlo de las siguientes maneras:

1. Usando npm:
bash
npm install -g pnpm


2. Usando Windows PowerShell:
bash
iwr https://get.pnpm.io/install.ps1 -useb | iex


3. Verificar la instalación:
bash
pnpm --version


## Instalación 

1. Clona el repositorio:
bash
git clone <https://github.com/ArielTonato/buses-back>


2. Instala las dependencias:
bash
pnpm install


3. Configura las variables de entorno:
Crea un archivo .env en la raíz del proyecto con las siguientes variables:
env

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=bd_buses

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_FROM=tu_email@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret


Asegúrate de reemplazar los valores con tus propias credenciales.

4. Inicia el servidor de desarrollo:
bash
pnpm run start:dev


## Estructura del Proyecto 
```
src/
│
├── auth/             # Módulo de gestión de autenticación
├── boletos/          # Módulo de gestión de boletos
├── buses/            # Módulo de gestión de buses
├── cloudinary/       # Módulo de gestión para la carga de imágenes y PDFs
├── cooperativa/      # Módulo de configuración de la cooperativa
├── factura/          # Módulo de facturación
├── frecuencias/      # Módulo de gestión de frecuencias
├── reserva/          # Módulo de reservas
├── mail/             # Módulo de envío de emails
├── user/             # Módulo de usuarios
├── common/           # Utilidades compartidas
└── app.module.ts     # Módulo principal de la aplicación
```

## Documentación API 

La documentación de la API está disponible en Swagger. Para acceder:

1. Inicia el servidor
2. Visita http://localhost:3000/api/docs o el puerto correspondiente en tu servidor

## Endpoints Principales 

Revisar la documentación de Swagger para obtener detalles completos de los endpoints.

- POST /reserva - Crear una nueva reserva
- GET /boletos - Listar todos los boletos
- GET /factura - Obtener las facturas
- GET /cooperativa - Listar cooperativa

## Módulos Principales 

### Módulo de Reservas
- Gestión de reservas de asientos
- Estado de reservas (pendiente, confirmada, cancelada)
- Asignación de asientos
- Escoger destino
- Escoger metodo de pago

### Módulo de Boletos
- Generación de boletos
- Códigos QR
- Validación de boletos

### Módulo de Facturas
- Generación automática de facturas
- Historial de facturas

### Módulo de Frecuencias
- Gestión de frecuencias
- Asignación de buses a frecuencias
- Asignación de conductores a frecuencias
- Asignación de horarios a frecuencias
- Asignación de origen y destino a frecuencias

## Pruebas 

Para ejecutar las pruebas:

Las pruebas se realizaron Rest Client y Postman, para ver los tests revisar la carpeta tests


## Tecnologías Utilizadas 

- [Node.js](https://nodejs.org/) - Entorno de ejecución
- [NestJS](https://nestjs.com/) - Framework de backend
- [MySQL](https://www.mysql.com/) - Base de datos
- [TypeORM](https://typeorm.io/) - ORM
- [Swagger](https://swagger.io/) - Documentación API

## Autores 

* *Ariel Tonato* - Desarrollo - [ArielTonato](https://github.com/ArielTonato)

## Licencia 

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Agradecimientos 

* Universidad Técnica de Ambato
* Docente del proyecto
