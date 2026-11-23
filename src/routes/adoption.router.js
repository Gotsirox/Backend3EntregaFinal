import { Router } from 'express';
import { createAdoptionsController } from '../controllers/adoptions.controller.js';

const createAdoptionsRouter = (adoptions, users, pets) => {
    const router = Router();
    const adoptionsController = createAdoptionsController(adoptions, users, pets);

    router.get('/', adoptionsController.getAllAdoptions);
    router.get('/:aid', adoptionsController.getAdoption);
    router.post('/:uid/:pid', adoptionsController.createAdoption);

    return router;
};

export { createAdoptionsRouter };
export default createAdoptionsRouter();
