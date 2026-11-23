import express from 'express';
import cookieParser from 'cookie-parser';
import SwaggerUI from 'swagger-ui-express';
import swaggerJSON from './docs/swagger.json' with { type: 'json' };

import { loggerTest } from './utils/logger.js';
import { createUsersRouter } from './routes/users.router.js';
import { createPetsRouter } from './routes/pets.router.js';
import { createAdoptionsRouter } from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from './middlewares/errorHandler.js';
import { usersService, petsService, adoptionsService } from './services/index.js';

// Patrón de la clase 6: la app se crea con servicios inyectables para los tests
const createApp = ({ users = usersService, pets = petsService, adoptions = adoptionsService } = {}) => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/users', createUsersRouter(users));
    app.use('/api/pets', createPetsRouter(pets));
    app.use('/api/adoptions', createAdoptionsRouter(adoptions, users, pets));
    app.use('/api/sessions', sessionsRouter);
    app.use('/api/mocks', mocksRouter);

    // Logging (clase 3)
    app.use('/loggerTest', loggerTest);

    // Swagger (clase 5)
    app.use('/api/docs', SwaggerUI.serve);
    app.get('/api/docs', SwaggerUI.setup(swaggerJSON));
    app.get('/api/docs.json', (req, res) => res.json(swaggerJSON));

    app.use(errorHandler);

    return app;
};

export { createApp };
export default createApp();
