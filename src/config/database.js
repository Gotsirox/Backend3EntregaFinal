import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
    if (!config.mongoUrl) {
        console.warn('MONGODB_URI no definida: se omite la conexión a MongoDB.');
        return null;
    }

    try {
        const connection = await mongoose.connect(config.mongoUrl);
        console.log('Conectado a MongoDB');
        return connection;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        throw error;
    }
};
