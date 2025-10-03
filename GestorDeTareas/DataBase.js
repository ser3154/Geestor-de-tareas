// database.js
const { MongoClient, ObjectId } = require('mongodb');

class Database {
    constructor() {
        this.uri = 'mongodb://localhost:27017';
        this.dbName = 'task_manager_db';
        this.client = null;
        this.db = null;
    }

    async conectar() {
        try {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('✓ Conectado exitosamente a MongoDB');
            return this.db;
        } catch (error) {
            console.error('✗ Error al conectar a MongoDB:', error);
            throw error;
        }
    }

    async desconectar() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('✓ Desconectado de MongoDB');
            }
        } catch (error) {
            console.error('✗ Error al desconectar:', error);
            throw error;
        }
    }

    obtenerDB() {
        if (!this.db) {
            throw new Error('No hay conexión a la base de datos');
        }
        return this.db;
    }

    static crearObjectId(id = null) {
        return id ? new ObjectId(id) : new ObjectId();
    }
}

module.exports = Database;

