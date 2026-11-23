import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
import { logger } from './utils/logger.js';

await connectDB();

app.listen(config.port, () => {
    console.log(`Listening on ${config.port}`);
    logger.info(`Servidor escuchando en puerto: ${config.port}`);
});
