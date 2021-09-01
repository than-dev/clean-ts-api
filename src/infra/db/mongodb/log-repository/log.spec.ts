import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log';

describe('Log Mongo Repository', () => {
    let errorCollection: Collection;

    const makeSut = (): LogMongoRepository => {
        return new LogMongoRepository();
    };

    beforeAll(async (): Promise<void> => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors');
        await errorCollection.deleteMany({});
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    it('should create an error log on success', async () => {
        const sut = makeSut();
        await sut.log('any_error');
        const count = await errorCollection.countDocuments();
        expect(count).toBe(1);
    });
});
