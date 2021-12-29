/* eslint-disable @typescript-eslint/brace-style */
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import {
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from '@/data/usecases/account/authentication/db-authentication-protocols';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/account/add-account';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';

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
