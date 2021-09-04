import { AccountModel } from '../../../../domain/models/account';
/* eslint-disable @typescript-eslint/brace-style */
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';

export class AccountMongoRepository
    implements AddAccountRepository, LoadAccountByEmailRepository
{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const { insertedId } = await accountCollection.insertOne(accountData);

        const account = await accountCollection.findOne({ _id: insertedId });

        return Object.assign({
            ...account,
            id: account._id
        });
    }

    async loadByEmail(email: string): Promise<any> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const account = await accountCollection.findOne({
            email
        });
        return account;
    }

    async updateAccessToken(id: ObjectId, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.updateOne(
            { _id: id },
            {
                $set: {
                    accessToken: token
                }
            }
        );
    }
}
