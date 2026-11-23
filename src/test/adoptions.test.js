import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../app.js';
import { InMemoryService } from './mocks/inMemory.service.js';

const userFixture = {
    _id: 'user-1',
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@example.com',
    role: 'user',
    pets: []
};
const petFixture = { _id: 'pet-1', name: 'Mora', specie: 'dog', birthDate: '2020-05-01', adopted: false };
const adoptedPetFixture = { _id: 'pet-2', name: 'Luna', specie: 'cat', birthDate: '2021-07-09', adopted: true };
const adoptionFixture = { _id: 'adoption-1', owner: 'user-1', pet: 'pet-1' };

const createTestApp = ({ users = [userFixture], pets = [petFixture], adoptions = [] } = {}) => {
    const usersService = new InMemoryService(users);
    const petsService = new InMemoryService(pets);
    const adoptionsService = new InMemoryService(adoptions);

    return {
        app: createApp({ users: usersService, pets: petsService, adoptions: adoptionsService }),
        usersService,
        petsService,
        adoptionsService
    };
};

describe('Tests funcionales: adoption.router.js', () => {
    describe('GET /api/adoptions', () => {
        it('devuelve 200 con el listado de adopciones', async () => {
            const { app } = createTestApp({ adoptions: [adoptionFixture] });

            const response = await request(app).get('/api/adoptions').expect(200);

            expect(response.body).to.deep.equal({ status: 'success', payload: [adoptionFixture] });
        });

        it('devuelve 500 cuando el servicio falla', async () => {
            const failingAdoptions = {
                getAll: async () => { throw new Error('DB caída'); },
                getBy: async () => null,
                create: async () => null,
                update: async () => null,
                delete: async () => null
            };
            const app = createApp({
                users: new InMemoryService([userFixture]),
                pets: new InMemoryService([petFixture]),
                adoptions: failingAdoptions
            });

            const response = await request(app).get('/api/adoptions').expect(500);

            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('DB caída');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('devuelve 200 con la adopción solicitada', async () => {
            const { app } = createTestApp({ adoptions: [adoptionFixture] });

            const response = await request(app).get('/api/adoptions/adoption-1').expect(200);

            expect(response.body).to.deep.equal({ status: 'success', payload: adoptionFixture });
        });

        it('devuelve 404 cuando la adopción no existe', async () => {
            const { app } = createTestApp();

            const response = await request(app).get('/api/adoptions/inexistente').expect(404);

            expect(response.body).to.deep.equal({ status: 'error', error: 'Adoption not found' });
        });

        it('devuelve 500 cuando el servicio falla', async () => {
            const failingAdoptions = {
                getAll: async () => [],
                getBy: async () => { throw new Error('DB caída'); },
                create: async () => null,
                update: async () => null,
                delete: async () => null
            };
            const app = createApp({
                users: new InMemoryService([userFixture]),
                pets: new InMemoryService([petFixture]),
                adoptions: failingAdoptions
            });

            const response = await request(app).get('/api/adoptions/adoption-1').expect(500);

            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('DB caída');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('adopta una mascota y actualiza usuario, mascota y adopción', async () => {
            const { app, usersService, petsService, adoptionsService } = createTestApp();

            const response = await request(app).post('/api/adoptions/user-1/pet-1').expect(200);
            expect(response.body).to.deep.equal({ status: 'success', message: 'Pet adopted' });

            const user = await usersService.getUserById('user-1');
            expect(user.pets).to.include('pet-1');

            const pet = await petsService.getBy({ _id: 'pet-1' });
            expect(pet).to.include({ adopted: true, owner: 'user-1' });

            const adoptions = await adoptionsService.getAll();
            expect(adoptions).to.have.lengthOf(1);
            expect(adoptions[0]).to.include({ owner: 'user-1', pet: 'pet-1' });
        });

        it('devuelve 404 y no crea la adopción si el usuario no existe', async () => {
            const { app, adoptionsService } = createTestApp({ users: [] });

            const response = await request(app).post('/api/adoptions/noUser/pet-1').expect(404);
            expect(response.body.error).to.equal('user Not found');
            expect(await adoptionsService.getAll()).to.have.lengthOf(0);
        });

        it('devuelve 404 y no crea la adopción si la mascota no existe', async () => {
            const { app, adoptionsService } = createTestApp({ pets: [] });

            const response = await request(app).post('/api/adoptions/user-1/noPet').expect(404);
            expect(response.body.error).to.equal('Pet not found');
            expect(await adoptionsService.getAll()).to.have.lengthOf(0);
        });

        it('devuelve 400 si la mascota ya fue adoptada', async () => {
            const { app, adoptionsService } = createTestApp({ pets: [adoptedPetFixture] });

            const response = await request(app).post('/api/adoptions/user-1/pet-2').expect(400);
            expect(response.body.error).to.equal('Pet is already adopted');
            expect(await adoptionsService.getAll()).to.have.lengthOf(0);
        });

        it('devuelve 500 cuando falla la creación de la adopción', async () => {
            const failingAdoptions = {
                getAll: async () => [],
                getBy: async () => null,
                create: async () => { throw new Error('DB caída'); },
                update: async () => null,
                delete: async () => null
            };
            const app = createApp({
                users: new InMemoryService([userFixture]),
                pets: new InMemoryService([petFixture]),
                adoptions: failingAdoptions
            });

            const response = await request(app).post('/api/adoptions/user-1/pet-1').expect(500);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('DB caída');
        });
    });
});
