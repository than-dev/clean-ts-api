import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { InsertOneResult } from 'mongodb';

export class AccountMongoRepository implements AddAccountRepository {
    async add(
        accountData: AddAccountModel
    ): Promise<InsertOneResult<Document>> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);

        return result;
    }
}
