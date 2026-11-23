import { adoptionsService, petsService, usersService } from "../services/index.js";
import { logger } from "../utils/logger.js";
import asyncHandler from "../utils/asyncHandler.js";

const createAdoptionsController = (adoptions = adoptionsService, users = usersService, pets = petsService) => {
    const getAllAdoptions = asyncHandler(async (req, res) => {
        const result = await adoptions.getAll();
        res.send({ status: "success", payload: result });
    });

    const getAdoption = asyncHandler(async (req, res) => {
        const adoption = await adoptions.getBy({ _id: req.params.aid });
        if (!adoption) {
            logger.error("No existe la adopción");
            return res.status(404).send({ status: "error", error: "Adoption not found" });
        }
        res.send({ status: "success", payload: adoption });
    });

    const createAdoption = asyncHandler(async (req, res) => {
        const { uid, pid } = req.params;
        const user = await users.getUserById(uid);
        if (!user) {
            logger.error("No existe el usuario al crear la adopción");
            return res.status(404).send({ status: "error", error: "user Not found" });
        }
        const pet = await pets.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });

        user.pets.push(pet._id);
        await users.update(user._id, { pets: user.pets });
        await pets.update(pet._id, { adopted: true, owner: user._id });
        await adoptions.create({ owner: user._id, pet: pet._id });
        res.send({ status: "success", message: "Pet adopted" });
    });

    return { createAdoption, getAllAdoptions, getAdoption };
};

export default createAdoptionsController();
export { createAdoptionsController };
