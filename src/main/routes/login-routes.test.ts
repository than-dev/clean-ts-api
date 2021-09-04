import { app } from '../config/app';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

let accountCollection: Collection;

describe('Login Routes', () => {
    beforeAll(async (): Promise<void> => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    describe('POST /signup', () => {
        it('should return 200 on signup success', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Nathan',
                    email: 'nathan.cotrim@gmail.com',
                    password: 'valid_pass',
                    passwordConfirmation: 'valid_pass'
                })
                .expect(200);
        });
    });

    describe('POST /login', () => {
        it('should return 200 on login success', async () => {
            const hashedPassword = await hash('valid_pass', 12);
            await accountCollection.insertOne({
                name: 'Nathan',
                email: 'nathan.cotrim@gmail.com',
                password: hashedPassword
            });

            await request(app)
                .post('/api/login')
                .send({
                    email: 'nathan.cotrim@gmail.com',
                    password: 'valid_pass'
                })
                .expect(200);
        });
    });
});
