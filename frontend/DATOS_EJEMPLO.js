/* =============================================================================
   DATOS DE EJEMPLO PARA MONGODB
   Copia y pega estos datos en MongoDB Compass o usa mongoimport
   ============================================================================= */

// ============================================================================
// USUARIOS
// ============================================================================

db.usuarios.insertOne({
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "nombre": "Juan García",
    "email": "juan@example.com",
    "password": "$2b$10$...", // Hash bcrypt (genera el tuyo con bcryptjs)
    "fecha_creacion": new Date("2025-01-01"),
    "estado": "activo"
});

// ============================================================================
// CATEGORÍAS
// ============================================================================

db.categorias.insertMany([
    {
        "_id": ObjectId("507f1f77bcf86cd799439012"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Matemáticas",
        "descripcion": "Tareas de la clase de matemáticas",
        "color": "#1E3A8A",
        "fecha_creacion": new Date()
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439013"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Programación",
        "descripcion": "Proyectos y tareas de programación",
        "color": "#7C3AED",
        "fecha_creacion": new Date()
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439014"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Literatura",
        "descripcion": "Lecturas y análisis de textos",
        "color": "#EC4899",
        "fecha_creacion": new Date()
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439015"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Histórico",
        "descripcion": "Tareas relacionadas con historia",
        "color": "#F59E0B",
        "fecha_creacion": new Date()
    }
]);

// ============================================================================
// TAREAS
// ============================================================================

db.tareas.insertMany([
    {
        "_id": ObjectId("507f1f77bcf86cd799439020"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "categoriaId": ObjectId("507f1f77bcf86cd799439012"),
        "nombre": "Resolver ejercicios de cálculo",
        "descripcion": "Capítulo 5, ejercicios 1-20 del libro de texto",
        "fecha_vencimiento": new Date("2025-12-15"),
        "fecha_creacion": new Date(),
        "estado": "pendiente",
        "prioridad": "alta",
        "notasAdicionales": []
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439021"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "categoriaId": ObjectId("507f1f77bcf86cd799439013"),
        "nombre": "Implementar login en la aplicación",
        "descripcion": "Crear sistema de autenticación con JWT",
        "fecha_vencimiento": new Date("2025-12-10"),
        "fecha_creacion": new Date(),
        "estado": "pendiente",
        "prioridad": "alta",
        "notasAdicionales": []
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439022"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "categoriaId": ObjectId("507f1f77bcf86cd799439014"),
        "nombre": "Leer 'Don Quijote' capítulos 1-3",
        "descripcion": "Lectura para la próxima clase",
        "fecha_vencimiento": new Date("2025-12-20"),
        "fecha_creacion": new Date(),
        "estado": "pendiente",
        "prioridad": "media",
        "notasAdicionales": []
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439023"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "categoriaId": ObjectId("507f1f77bcf86cd799439015"),
        "nombre": "Escribir ensayo sobre la Revolución Francesa",
        "descripcion": "Mínimo 2000 palabras, formato APA",
        "fecha_vencimiento": new Date("2025-12-25"),
        "fecha_creacion": new Date(),
        "estado": "completada",
        "prioridad": "alta",
        "notasAdicionales": []
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439024"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "categoriaId": ObjectId("507f1f77bcf86cd799439012"),
        "nombre": "Examen parcial de Trigonometría",
        "descripcion": "Traer calculadora científica",
        "fecha_vencimiento": new Date("2025-12-18"),
        "fecha_creacion": new Date(),
        "estado": "pendiente",
        "prioridad": "alta",
        "notasAdicionales": []
    }
]);

// ============================================================================
// NOTAS
// ============================================================================

db.notas.insertMany([
    {
        "_id": ObjectId("507f1f77bcf86cd799439030"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "contenido": "Recordar traer materiales para el laboratorio",
        "color": "#B8FF00",
        "fecha_creacion": new Date()
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439031"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "contenido": "Estudiar fórmulas de derivadas antes del examen",
        "color": "#06B6D4",
        "fecha_creacion": new Date()
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439032"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "contenido": "Contactar al profesor sobre la tarea adicional",
        "color": "#EC4899",
        "fecha_creacion": new Date()
    }
]);

// ============================================================================
// LOGROS
// ============================================================================

db.logros.insertMany([
    {
        "_id": ObjectId("507f1f77bcf86cd799439040"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Primeros pasos",
        "descripcion": "Completa tu primera tarea",
        "icono": "🚀",
        "fecha_otorgado": new Date(),
        "criterio": {
            "tipo": "tareas_completadas",
            "valor": 1
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439041"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Productivo",
        "descripcion": "Completa 5 tareas",
        "icono": "⭐",
        "fecha_otorgado": new Date(),
        "criterio": {
            "tipo": "tareas_completadas",
            "valor": 5
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439042"),
        "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "En llamas",
        "descripcion": "Mantén una racha de 7 días",
        "icono": "🔥",
        "criterio": {
            "tipo": "racha_dias",
            "valor": 7
        }
    }
]);

// ============================================================================
// RACHAS
// ============================================================================

db.rachas.insertOne({
    "_id": ObjectId("507f1f77bcf86cd799439050"),
    "usuarioId": ObjectId("507f1f77bcf86cd799439011"),
    "dias": 3,
    "ultima_tarea_completada": new Date(),
    "fecha_inicio_racha": new Date("2025-11-15")
});

// ============================================================================
// INSTRUCCIONES
// ============================================================================

/*
1. Abre MongoDB Compass o MongoDB Shell

2. Selecciona tu base de datos: gestordetareas

3. Copiar y pega cada sección individualmente en el shell, O:

4. Usa mongoimport:
   mongoimport --db gestordetareas --collection usuarios < usuarios.json

5. IMPORTANTE: Antes de insertar el usuario, genera un hash bcrypt para la contraseña:
   
   En Node.js:
   const bcryptjs = require('bcryptjs');
   const password = 'tu_contraseña';
   const hash = bcryptjs.hashSync(password, 10);
   console.log(hash);

6. Reemplaza la contraseña en el objeto de usuario con el hash generado

7. Ahora sí, inserta los datos en MongoDB

8. Prueba iniciar sesión con:
   Email: juan@example.com
   Contraseña: (la que hayas usado)
*/
