# Plataforma Bancaria Digital - Numia

Aplicación full-stack que implementa un flujo completo de onboarding para productos bancarios, construida bajo una arquitectura de microservicios con principios de Clean Architecture y comunicación asíncrona entre servicios.

## Arquitectura y Stack Tecnológico

### Arquitectura General

```
┌─────────────┐
│   Frontend  │ (Next.js 16 + React 19)
│  (Port 3001)│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│          API Gateway (Port 3000)            │
│  - Routing                                  │
│  - JWT Verification                         │
│  - Request Forwarding                       │
└───────┬─────────────────────────────────────┘
        │
        ├──────────────┬──────────────┬─────────────┐
        ▼              ▼              ▼             ▼
   ┌────────┐    ┌──────────┐   ┌──────────┐  ┌──────────┐
   │  Auth  │    │ Product  │   │Onboarding│  │Validation│
   │Service │    │ Service  │   │ Service  │  │ Service  │
   └───┬────┘    └────┬─────┘   └────┬─────┘  └────┬─────┘
       │              │               │             │
       ▼              ▼               ▼             │
  ┌────────┐    ┌────────┐      ┌────────┐        │
  │Postgres│    │Postgres│      │Postgres│        │
  │  Auth  │    │+ Redis │      │Onboard │        │
  └────────┘    └────────┘      └────────┘        │
                                      ▲             │
                                      └─────────────┘
                                    (HTTP Callback)
```

### Stack Tecnológico

#### Frontend

- **Framework**: Next.js 16 (App Router) con React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **Icons**: Phosphor React
- **Patrón**: Backend For Frontend (BFF) con API Routes

#### Backend (Microservicios)

- **Framework**: NestJS 11
- **Lenguaje**: TypeScript 5.7
- **Arquitectura**: Clean Architecture / Hexagonal
- **Validación**: class-validator + class-transformer
- **Testing**: Jest con cobertura unitaria

#### Bases de Datos

- **PostgreSQL 14**: Base de datos relacional para persistencia
- **Redis 6**: Sistema de caché para el servicio de productos
- **ORM**: TypeORM con mappers de dominio

#### Infraestructura

- **Containerización**: Docker + Docker Compose
- **Comunicación**: HTTP/REST entre servicios
- **Seguridad**: JWT para autenticación, cifrado AES-256-GCM para PII

## Features Principales

- **Autenticación de Usuarios**: Sistema JWT con cookies HttpOnly para máxima seguridad
- **Catálogo de Productos**: Listado dinámico con caché en Redis para optimización de rendimiento
- **Detalle de Producto**: Vista completa con beneficios, requisitos y términos
- **Flujo de Onboarding**:
  - Formulario multi-campo con validación robusta
  - Verificación asíncrona con simulación de 10 segundos
  - Callback automático para notificación de resultado
  - Cifrado de información sensible (PII) en base de datos
- **Sistema de Validación**: Servicio independiente que simula validación con probabilidad del 80% de aprobación
- **Seeding Automático**: Datos de prueba precargados para productos y usuario administrador

## Cómo Ejecutar el Proyecto

### Pre-requisitos

- Git
- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Puertos disponibles: 3000 (API Gateway), 3001 (Frontend), 5432-5434 (PostgreSQL), 6379 (Redis)

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/SoyJohnXD/BCS---Backend-test
cd BCS---Backend-test
```

2. **Crear archivo de variables de entorno**

```bash
cp .env.example .env
```

3. **Configurar variables de entorno** (ya están preconfiguradas, pero puedes ajustarlas)

```bash
JWT_SECRET=EstE_eS_mI_sEcReTo_pArA_lA_pRUEbA_123!
AUTH_SERVICE_URL=http://auth-service:3000
PRODUCT_SERVICE_URL=http://product-service:3000
ONBOARDING_SERVICE_URL=http://onboarding-service:3000
API_GATEWAY_URL=http://api-gateway:3000
AUTH_DATABASE_HOST=db-auth
AUTH_DATABASE_PORT=5432
AUTH_DATABASE_USER=admin
AUTH_DATABASE_PASSWORD=admin
AUTH_DATABASE_NAME=auth_db
PRODUCT_DATABASE_HOST=db-products
PRODUCT_DATABASE_PORT=5432
PRODUCT_DATABASE_USER=admin
PRODUCT_DATABASE_PASSWORD=admin
PRODUCT_DATABASE_NAME=products_db
PRODUCT_REDIS_HOST=redis-cache
PRODUCT_REDIS_PORT=6379
ONBOARDING_DATABASE_HOST=db-onboarding
ONBOARDING_DATABASE_PORT=5432
ONBOARDING_DATABASE_USER=admin
ONBOARDING_DATABASE_PASSWORD=admin
ONBOARDING_DATABASE_NAME=onboarding_db
VALIDATION_SERVICE_URL=http://validation-service:3000
ENCRYPTION_KEY=super-secret-key-must-be-32-char
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
AUTH_POSTGRES_DB=auth_db
PRODUCT_POSTGRES_DB=products_db
ONBOARDING_POSTGRES_DB=onboarding_db
```

### Ejecución

4. **Levantar todos los servicios**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Este comando:

- Construye las imágenes de todos los servicios
- Crea las bases de datos PostgreSQL
- Inicializa Redis
- Ejecuta seeders automáticos (usuario admin + 5 productos)
- Levanta todos los servicios en modo produccion

5. **Verificar que todos los servicios estén corriendo**

```bash
docker-compose ps
```

### Acceso

- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **API Gateway**: [http://localhost:3000](http://localhost:3000)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

### Datos de Prueba

**Usuario Administrador** (creado automáticamente por seeder):

```
Email: admin@bank.com
Password: Admin123!
```

**Productos Precargados**:

- Cuenta de Ahorros
- Tarjeta de Crédito Clásica
- Préstamo Personal
- Plan de Inversión
- Billetera Digital

### Detener los Servicios

```bash
docker-compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker-compose down -v
```

## Estructura del Proyecto

### Monorepo

```
.
├── api-gateway/          # Gateway centralizado con proxy y autenticación
├── auth-service/         # Servicio de autenticación y gestión de usuarios
├── product-service/      # Catálogo de productos con caché Redis
├── onboarding-service/   # Gestión de solicitudes de apertura
├── validation-service/   # Validación asíncrona de solicitudes
├── frontend/             # Aplicación Next.js (cliente web)
└── docker-compose.yml    # Orquestación de servicios
```

### Estructura Interna de Microservicios (Clean Architecture)

Cada servicio backend sigue una arquitectura en capas:

```
src/
├── domain/                 # Capa de dominio (lógica de negocio pura)
│   ├── entities/          # Entidades de negocio con reglas invariantes
│   ├── exceptions/        # Excepciones de dominio
│   ├── repositories/      # Interfaces de repositorio (abstracciones)
│   └── value-objects/     # Objetos de valor inmutables
│
├── application/           # Capa de aplicación (casos de uso)
│   ├── use-cases/        # Casos de uso orquestando dominio
│   ├── dto/              # DTOs de entrada/salida
│   └── ports/            # Puertos (interfaces) para infraestructura
│
├── infrastructure/        # Capa de infraestructura (detalles técnicos)
│   ├── persistence/      # Implementación de repositorios
│   │   ├── entities/     # Schemas de TypeORM
│   │   ├── mappers/      # Mappers dominio ↔ persistencia
│   │   └── repositories/ # Implementaciones concretas
│   ├── services/         # Adaptadores de servicios externos
│   └── seeding/          # Scripts de seeding
│
└── presentation/          # Capa de presentación (HTTP/REST)
    ├── controllers/      # Controladores REST
    ├── dto/              # DTOs de request/response
    └── filters/          # Filtros de excepciones HTTP
```

**Principios aplicados**:

- **Dependency Inversion**: Las capas internas no conocen las externas
- **Separation of Concerns**: Cada capa tiene una responsabilidad única
- **Testability**: Lógica de dominio sin dependencias de frameworks
- **Flexibility**: Fácil cambio de base de datos o frameworks

## Decisiones de Diseño

### ¿Por qué Microservicios?

- **Separación de responsabilidades**: Cada servicio gestiona un dominio específico
- **Escalabilidad independiente**: Producto Service puede escalar más que Auth si hay alta demanda
- **Despliegue independiente**: Cambios en onboarding no requieren redesplegar productos

### ¿Por qué un API Gateway?

- **Punto único de entrada**: Simplifica la comunicación cliente-servidor
- **Seguridad centralizada**: Validación de JWT en un solo lugar
- **Enrutamiento inteligente**: Proxy dinámico según rutas
- **Reducción de complejidad en frontend**: El cliente no necesita conocer múltiples endpoints
- **CORS centralizado**: Configuración de CORS en un solo punto

### ¿Por qué Redis para Product Service?

- **Rendimiento**: El catálogo de productos cambia poco, ideal para caché
- **Reducción de carga en BD**: Menor latencia y menos queries a PostgreSQL
- **TTL configurable**: Datos de productos expiran después de 1 hora
- **Escalabilidad**: Redis maneja miles de lecturas por segundo con latencia sub-milisegundo

### ¿Por qué TypeORM con Mappers?

- **Separación de concerns**: Los schemas de BD no contaminan el dominio
- **Type safety**: TypeScript asegura tipos en compile-time
- **Migraciones**: Gestión de cambios de schema con control de versiones
- **Flexibilidad**: Cambiar ORM no afecta la lógica de negocio

### ¿Por qué Docker?

- **Entorno unificado**: Todos los desarrolladores trabajan con el mismo entorno
- **Facilidad de onboarding**: Nuevo miembro del equipo arranca con un comando
- **Aislamiento**: Servicios no interfieren con otros proyectos en la máquina local
- **Preparación para producción**: Mismo setup local y en producción

### ¿Por qué Cifrado de PII?

- **Cumplimiento normativo**: Protección de datos personales según GDPR/leyes locales
- **Defensa en profundidad**: Aunque se comprometa la BD, los datos están cifrados
- **AES-256-GCM**: Estándar de la industria con autenticación integrada
- **Transformer de TypeORM**: Cifrado/descifrado transparente en la capa de persistencia

## Posibles Mejoras

### Arquitectura

- **Message Broker**: Implementar RabbitMQ o Kafka para comunicación asíncrona real en lugar de HTTP callbacks
- **Service Mesh**: Introducir Istio para observabilidad, circuit breaker y retry automático
- **Event Sourcing**: Para auditoría completa del flujo de onboarding
- **CQRS**: Separar comandos de consultas en servicios con alta carga

### Seguridad

- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **API Key Management**: Autenticación entre microservicios
- **Secrets Management**: Uso de Vault o AWS Secrets Manager
- **Audit Logging**: Registro detallado de todas las operaciones sensibles

### DevOps

- **CI/CD**: GitHub Actions o GitLab CI para despliegue automático

### Frontend

- **Optimistic Updates**: Mejorar UX con actualizaciones optimistas
- **Internacionalización**: Soporte multi-idioma

---

**Desarrollado como prueba técnica - Arquitectura de Microservicios**
