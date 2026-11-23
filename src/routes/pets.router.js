import { Router } from 'express';
import { createPetsController } from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import CustomError from '../utils/customError.js';

const createPetsRouter = (service) => {
    const router = Router();
    const petsController = createPetsController(service);

    router.get('/', petsController.getAllPets);
    router.post('/', petsController.createPet);
    router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);
    router.put('/:pid', petsController.updatePet);
    router.delete('/:pid', petsController.deletePet);

    const testError = (req, res, next) => next(new CustomError('Mascota no encontrada', 404));
    router.get('/test-error', testError);
    router.get('/testError', testError);

    return router;
};

export { createPetsRouter };
export default createPetsRouter();
