# Módulo de Notas - Gestor de Tareas

## Resumen de Implementación

Este documento describe la implementación completa del módulo de **Notas** para el sistema Gestor de Tareas, incluyendo autenticación JWT y manejo de errores centralizado.

## Funcionalidades Implementadas

### **1. Módulo de Notas (CRUD Completo)**
- ✅ Crear notas
- ✅ Obtener notas por usuario
- ✅ Obtener nota por ID
- ✅ Actualizar notas
- ✅ Eliminar notas

### **2. Sistema de Autenticación JWT**
- ✅ Login de usuarios
- ✅ Generación de tokens JWT
- ✅ Verificación de tokens
- ✅ Protección de endpoints

### **3. Manejo de Errores Centralizado**
- ✅ Middleware de manejo de errores
- ✅ Códigos de estado HTTP apropiados
- ✅ Mensajes de error descriptivos

## Archivos Creados/Modificados

### **Nuevos Archivos:**
```
controllers/
├── authController.js          # Controlador de autenticación
└── notasControllers.js        # Controlador de notas

middleware/
├── authMiddleware.js          # Middleware de autenticación JWT
└── errorHandler.js           # Middleware de manejo de errores

routes/
├── authRoutes.js              # Rutas de autenticación
└── notasRoutes.js             # Rutas de notas

.gitignore                     # Excluir node_modules
```

### **Archivos Modificados:**
```
server.js                      # Integración de nuevas rutas
dataAccess/NotaDAO.js          # Corrección para devolver objeto completo
package.json                   # Nueva dependencia: jsonwebtoken
```

## Endpoints Disponibles

### **Rutas Públicas (Sin Autenticación):**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verify` | Verificar token |

### **Rutas Protegidas (Con JWT):**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/notas` | Crear nueva nota |
| GET | `/api/notas/usuario/:usuarioId` | Obtener notas de usuario |
| GET | `/api/notas/:id` | Obtener nota por ID |
| PUT | `/api/notas/:id` | Actualizar nota |
| DELETE | `/api/notas/:id` | Eliminar nota |

## Autenticación JWT

### **Proceso de Login:**
1. Usuario envía credenciales a `/api/auth/login`
2. Sistema valida credenciales
3. Se genera token JWT con expiración de 24 horas
4. Token se incluye en header `Authorization: Bearer TOKEN`

### **Uso de Token:**
```javascript
// Header requerido para endpoints protegidos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Estructura de Datos

### **Nota:**
```json
{
  "contenido": "Texto de la nota",
  "tipo": "general",
  "usuarioId": "ObjectId del usuario",
  "fecha_creacion": "2024-01-01T00:00:00.000Z"
}
```

### **Respuesta de Login:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "ObjectId",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

## 🛡️ Validaciones Implementadas

### **Crear Nota:**
- ✅ `contenido` es obligatorio y no vacío
- ✅ `usuarioId` es obligatorio
- ✅ `tipo` es opcional (string)

### **Login:**
- ✅ `email` es obligatorio y formato válido
- ✅ `password` es obligatorio (mínimo 6 caracteres)

### **Actualizar Nota:**
- ✅ Validación de campos opcionales
- ✅ Verificación de tipos de datos

## 🔧 Códigos de Estado HTTP

| Código | Descripción | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token inválido/expirado |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Recurso duplicado |
| 500 | Internal Server Error | Error del servidor |

## Instalación y Uso

### **1. Instalar Dependencias:**
```bash
npm install
```

### **2. Ejecutar Servidor:**
```bash
node server.js
```

### **3. Ejemplo de Uso Completo:**

#### **Crear Usuario:**
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Pérez","email":"juan@ejemplo.com","password":"123456"}'
```

#### **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@ejemplo.com","password":"123456"}'
```

#### **Crear Nota (con JWT):**
```bash
curl -X POST http://localhost:3000/api/notas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{"contenido":"Mi primera nota","tipo":"personal","usuarioId":"ID_DEL_USUARIO"}'
```

## ✅ Cumplimiento de Requisitos

### **Requisitos del Entregable:**
- ✅ **Servicios RESTful**: CRUD completo implementado
- ✅ **Integración con Capa de Datos**: Uso directo de DAOs
- ✅ **Ruteo Separado**: Módulos dedicados
- ✅ **Códigos de Estado HTTP**: Implementados correctamente
- ✅ **Buenas Prácticas**: Separación de responsabilidades
- ✅ **Manejo de Errores**: Middleware centralizado
- ✅ **Validación de Entradas**: Validación estricta
- ✅ **Autenticación JWT**: Sistema completo implementado

## 👥 Contribución

**Desarrollador:** Javityan  
**Branch:** `feature/notas-module-with-jwt-auth`  
**Fecha:** 26/10/2025

## 📝 Notas Técnicas

- **JWT Secret**: Configurado en `authController.js` (en producción usar variables de entorno)
- **Expiración de Token**: 24 horas
- **Base de Datos**: MongoDB con Mongoose
- **Validación**: Implementada en controladores
- **Middleware**: Orden correcto en `server.js`
