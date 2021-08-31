import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
    beforeAll(async (): Promise<void> => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    };

    test('Should return an account on success', async () => {
        const sut = makeSut();
        const result = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        expect(result.insertedId).toBeTruthy();
    });
});
