/* eslint-disable @typescript-eslint/brace-style */
import { DbAddAccount } from './db-add-account';
import {
    Hasher,
    AccountModel,
    AddAccountRepository,
    LoadAccountByEmailRepository
} from './db-add-account-protocols';

import {
    mockAccountDataParams,
    mockAccountModel,
    throwError
} from '@/domain/test/';
import { mockAddAccountRepository, mockHasher } from '@/data/test';

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
        implements LoadAccountByEmailRepository
    {
        async loadByEmail(email: string): Promise<AccountModel> {
            return new Promise((resolve) => resolve(null));
        }
    }
    return new LoadAccountByEmailRepositoryStub();
};

type SutTypes = {
    sut: DbAddAccount;
    hasherStub: Hasher;
    addAccountRepositoryStub: AddAccountRepository;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
    const hasherStub = mockHasher();
    const addAccountRepositoryStub = mockAddAccountRepository();
    const sut = new DbAddAccount(
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    );
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    };
};

describe('DbAddAccount Usecase', () => {
    it('should call Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut();
        const hashSpy = jest.spyOn(hasherStub, 'hash');
        await sut.add(mockAccountDataParams());
        expect(hashSpy).toHaveBeenCalledWith('any_password');
    });

    it('should throw if Hasher throws', async () => {
        const { sut, hasherStub } = makeSut();
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);
        const promise = sut.add(mockAccountDataParams());
        await expect(promise).rejects.toThrow();
    });

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(mockAccountDataParams());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'hashed_password'
        });
    });

    it('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(
            throwError
        );
        const promise = sut.add(mockAccountDataParams());
        await expect(promise).rejects.toThrow();
    });

    it('should return an account on success', async () => {
        const { sut } = makeSut();
        const account = await sut.add(mockAccountDataParams());
        expect(account).toEqual(mockAccountModel());
    });

    it('should return null if LoadAccountByEmailRepository not return null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        ).mockReturnValueOnce(
            new Promise((resolve) => resolve(mockAccountModel()))
        );
        const account = await sut.add(mockAccountDataParams());
        expect(account).toBeNull();
    });

    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        );
        await sut.add(mockAccountDataParams());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});
