/* eslint-disable @typescript-eslint/brace-style */
import { LoadAccountByEmailRepository } from './../../../../data/protocols/db/load-account-by-email-repository';
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { InsertOneResult } from 'mongodb';

export class AccountMongoRepository
    implements AddAccountRepository, LoadAccountByEmailRepository
{
    async add(
        accountData: AddAccountModel
    ): Promise<InsertOneResult<Document>> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);

        return result;
    }

    async loadByEmail(email: string): Promise<any> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const account = await accountCollection.findOne({
            email
        });
        return account;
    }
}
