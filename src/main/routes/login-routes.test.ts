import { app } from '../config/app';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('Login Routes', () => {
    beforeAll(async (): Promise<void> => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts');
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
});
