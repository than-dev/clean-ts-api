import { mockAddAccountParams } from '@/tests/domain/mocks';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/';

import { Collection } from 'mongodb';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    };

    describe('add()', () => {
        it('should return an account on add success', async () => {
            const sut = makeSut();
            const account = await sut.add(mockAddAccountParams());
            expect(account).toBeTruthy();
            expect(account.id).toBeTruthy();
            expect(account.name).toBe('any_name');
            expect(account.email).toBe('any_email@mail.com');
            expect(account.password).toBe('any_password');
        });
    });

    describe('loadByEmail()', () => {
        it('should return an account on loadByEmail success', async () => {
            const sut = makeSut();
            await accountCollection.insertOne(mockAddAccountParams());

            const account = await sut.loadByEmail('any_email@mail.com');

            expect(account).toBeTruthy();
            expect(account.id).toBeTruthy();
            expect(account.name).toBe('any_name');
            expect(account.email).toBe('any_email@mail.com');
            expect(account.password).toBe('any_password');
        });

        it('should return null if loadByEmail fails', async () => {
            const sut = makeSut();
            const account = await sut.loadByEmail('any_email@mail.com');
            expect(account).toBeFalsy();
        });
    });

    describe('updateAccessToken()', () => {
        it('should update the account accessToken on updateAccessToken success', async () => {
            const sut = makeSut();
            const { insertedId } = await accountCollection.insertOne(
                mockAddAccountParams()
            );
            const account = await accountCollection.findOne({
                _id: insertedId
            });
            expect(account.accessToken).toBeFalsy();

            await sut.updateAccessToken(insertedId, 'any_token');

            const { accessToken } = await accountCollection.findOne({
                _id: insertedId
            });

            expect(accessToken).toBeTruthy();
        });
    });

    describe('loadByToken()', () => {
        it('should return an account on loadByToken without role', async () => {
            const sut = makeSut();
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token'
            });

            const account = await sut.loadByToken('any_token');

            expect(account).toBeTruthy();
            expect(account.id).toBeTruthy();
            expect(account.name).toBe('any_name');
            expect(account.email).toBe('any_email@mail.com');
            expect(account.password).toBe('any_password');
        });

        it('should return an account on loadByToken with admin role', async () => {
            const sut = makeSut();
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'admin'
            });

            const account = await sut.loadByToken('any_token', 'admin');

            expect(account).toBeTruthy();
            expect(account.id).toBeTruthy();
            expect(account.name).toBe('any_name');
            expect(account.email).toBe('any_email@mail.com');
            expect(account.password).toBe('any_password');
        });

        it('should return null on loadByToken with invalid role', async () => {
            const sut = makeSut();
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token'
            });

            const account = await sut.loadByToken('any_token', 'admin');

            expect(account).toBeFalsy();
        });

        it('should return an account on loadByToken with if user is admin', async () => {
            const sut = makeSut();
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'admin'
            });

            const account = await sut.loadByToken('any_token');

            expect(account).toBeTruthy();
            expect(account.id).toBeTruthy();
            expect(account.name).toBe('any_name');
            expect(account.email).toBe('any_email@mail.com');
            expect(account.password).toBe('any_password');
        });

        it('should return null if loadByToken fails', async () => {
            const sut = makeSut();
            const account = await sut.loadByToken('any_token');
            expect(account).toBeFalsy();
        });
    });
});
