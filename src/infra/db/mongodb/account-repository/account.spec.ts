import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
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

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    };

    it('should return an account on success', async () => {
        const sut = makeSut();
        const result = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        expect(result.id).toBeTruthy();
    });

    it('should return an account on success', async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        const account = await sut.loadByEmail('any_email@mail.com');
        expect(account).toBeTruthy();
        expect(account._id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });

    it('should return null if loadByEmail fails', async () => {
        const sut = makeSut();
        const account = await sut.loadByEmail('any_email@mail.com');
        expect(account).toBeFalsy();
    });

    it('should update the account accessToken on updateAccessToken success', async () => {
        const sut = makeSut();
        const { insertedId } = await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        const account = await accountCollection.findOne({ _id: insertedId });
        expect(account.accessToken).toBeFalsy();

        await sut.updateAccessToken(insertedId, 'any_token');

        const { accessToken } = await accountCollection.findOne({
            _id: insertedId
        });

        expect(accessToken).toBeTruthy();
    });
});
