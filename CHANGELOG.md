# Changelog - Módulo de Notas

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### ✨ Agregado
- **Módulo completo de Notas** con operaciones CRUD
  - Crear notas (`POST /api/notas`)
  - Obtener notas por usuario (`GET /api/notas/usuario/:usuarioId`)
  - Obtener nota por ID (`GET /api/notas/:id`)
  - Actualizar notas (`PUT /api/notas/:id`)
  - Eliminar notas (`DELETE /api/notas/:id`)

- **Sistema de autenticación JWT**
  - Login de usuarios (`POST /api/auth/login`)
  - Verificación de tokens (`GET /api/auth/verify`)
  - Middleware de autenticación para proteger endpoints
  - Generación de tokens con expiración de 24 horas

- **Middleware de manejo de errores centralizado**
  - Manejo de errores de validación de Mongoose
  - Manejo de errores de JWT (inválido, expirado)
  - Manejo de errores de duplicados (código 11000)
  - Manejo de errores de casteo de ObjectId
  - Respuestas de error consistentes con códigos HTTP apropiados

- **Validación de entradas**
  - Validación estricta en controladores de notas
  - Validación de credenciales en autenticación
  - Validación de tipos de datos y formatos
  - Mensajes de error descriptivos

### Modificado
- **NotaDAO.js**: Corregido método `crear()` para devolver objeto completo en lugar de solo ID
- **server.js**: Integración de nuevas rutas con separación de rutas públicas/protegidas
- **package.json**: Agregada dependencia `jsonwebtoken`

### Seguridad
- **Autenticación JWT**: Todos los endpoints de notas requieren token válido
- **Validación de tokens**: Verificación de formato Bearer y validez del token
- **Manejo seguro de errores**: No exposición de información sensible en errores

### Documentación
- **README_NOTAS.md**: Documentación completa del módulo
- **CHANGELOG.md**: Registro de cambios
- **Comentarios en código**: Documentación inline en controladores y middleware

### Arquitectura
- **Separación de responsabilidades**: Controladores, rutas, middleware separados
- **Patrón MVC**: Modelo-Vista-Controlador implementado
- **Middleware pipeline**: Orden correcto de middleware en Express
- **Ruteo modular**: Rutas organizadas en módulos dedicados

### Códigos de Estado HTTP
- **200 OK**: Operaciones exitosas
- **201 Created**: Recursos creados exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token JWT inválido o expirado
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Recurso duplicado
- **500 Internal Server Error**: Errores del servidor

### Dependencias
- **jsonwebtoken**: ^9.0.0 - Para autenticación JWT

### Flujo de Trabajo
1. Usuario se registra (`POST /api/usuarios`)
2. Usuario inicia sesión (`POST /api/auth/login`)
3. Sistema genera token JWT
4. Usuario incluye token en headers para operaciones protegidas
5. Middleware valida token antes de procesar solicitudes
6. Operaciones CRUD en notas con autenticación

### Cumplimiento de Requisitos
- ✅ Servicios RESTful para todas las entidades
- ✅ Integración con capa de datos (DAOs)
- ✅ Ruteo separado en módulos
- ✅ Códigos de estado HTTP apropiados
- ✅ Buenas prácticas de desarrollo
- ✅ Manejo de errores centralizado (middleware)
- ✅ Validación de entradas estricta
- ✅ Autenticación JWT implementada
- ✅ Protección de endpoints sensibles

---

**Desarrollador:** Javityan  
**Branch:** `feature/notas-module-with-jwt-auth`  
**Fecha de Implementación:** 26/10/2025
