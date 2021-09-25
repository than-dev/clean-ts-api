/* eslint-disable @typescript-eslint/brace-style */
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { ObjectId } from 'mongodb';
import { LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token';

export class AccountMongoRepository
    implements
        AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAccessTokenRepository,
        LoadAccountByToken
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

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const account = await accountCollection.findOne({ email });
        return account && MongoHelper.map(account);
    }

    async updateAccessToken(
        id: string | ObjectId,
        token: string
    ): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.updateOne(
            {
                _id: id
            },
            {
                $set: {
                    accessToken: token
                }
            }
        );
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const account = await accountCollection.findOne({
            accessToken: token,
            $or: [
                {
                    role
                },
                {
                    role: 'admin'
                }
            ]
        });
        return account && MongoHelper.map(account);
    }
}
