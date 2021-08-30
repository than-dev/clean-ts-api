import { app } from '../config/app';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
    beforeAll(async (): Promise<void> => {
        await MongoHelper.connect();
    });

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    it('should return an account on success', async () => {
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
