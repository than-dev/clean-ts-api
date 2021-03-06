import { setupApp } from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';

import { Collection } from 'mongodb';
import { Express } from 'express';
import { hash } from 'bcrypt';
import request from 'supertest';

let accountCollection: Collection;
let app: Express;

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);

        app = await setupApp();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    describe('POST /signup', () => {
        it('should return 200 on signup', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Rodrigo',
                    email: 'rodrigo.manguinho@gmail.com',
                    password: '123',
                    passwordConfirmation: '123'
                })
                .expect(200);
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Rodrigo',
                    email: 'rodrigo.manguinho@gmail.com',
                    password: '123',
                    passwordConfirmation: '123'
                })
                .expect(403);
        });
    });

    describe('POST /login', () => {
        it('should return 200 on login', async () => {
            const password = await hash('123', 12);
            await accountCollection.insertOne({
                name: 'Rodrigo',
                email: 'rodrigo.manguinho@gmail.com',
                password
            });
            await request(app)
                .post('/api/login')
                .send({
                    email: 'rodrigo.manguinho@gmail.com',
                    password: '123'
                })
                .expect(200);
        });

        it('should return 401 on login', async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: 'rodrigo.manguinho@gmail.com',
                    password: '123'
                })
                .expect(401);
        });
    });
});
