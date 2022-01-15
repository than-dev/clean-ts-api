/* eslint-disable @typescript-eslint/brace-style */
import { DbAddAccount } from './db-add-account';
import {
    Hasher,
    AddAccountRepository,
    LoadAccountByEmailRepository
} from './db-add-account-protocols';

import {
    mockAddAccountParams,
    mockAccountModel,
    throwError
} from '@/domain/test';
import {
    mockAddAccountRepository,
    mockHasher,
    mockLoadAccountByEmailRepository
} from '@/data/test';

type SutTypes = {
    sut: DbAddAccount;
    hasherSpy: Hasher;
    addAccountRepositorySpy: AddAccountRepository;
    loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValue(
        Promise.resolve(null)
    );

    const hasherSpy = mockHasher();
    const addAccountRepositorySpy = mockAddAccountRepository();
    const sut = new DbAddAccount(
        hasherSpy,
        addAccountRepositorySpy,
        loadAccountByEmailRepositorySpy
    );
    return {
        sut,
        hasherSpy,
        addAccountRepositorySpy,
        loadAccountByEmailRepositorySpy
    };
};

describe('DbAddAccount Usecase', () => {
    it('should call Hasher with correct password', async () => {
        const { sut, hasherSpy } = makeSut();
        const hashSpy = jest.spyOn(hasherSpy, 'hash');
        await sut.add(mockAddAccountParams());
        expect(hashSpy).toHaveBeenCalledWith('any_password');
    });

    it('should throw if Hasher throws', async () => {
        const { sut, hasherSpy } = makeSut();
        jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
        const promise = sut.add(mockAddAccountParams());
        await expect(promise).rejects.toThrow();
    });

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositorySpy } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositorySpy, 'add');
        await sut.add(mockAddAccountParams());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'hashed_password'
        });
    });

    it('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositorySpy } = makeSut();
        jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(
            throwError
        );
        const promise = sut.add(mockAddAccountParams());
        await expect(promise).rejects.toThrow();
    });

    it('should return an account on success', async () => {
        const { sut } = makeSut();
        const account = await sut.add(mockAddAccountParams());
        expect(account).toEqual(mockAccountModel());
    });

    it('should return null if LoadAccountByEmailRepository not return null', async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositorySpy,
            'loadByEmail'
        ).mockReturnValueOnce(Promise.resolve(mockAccountModel()));
        const account = await sut.add(mockAddAccountParams());
        expect(account).toBeNull();
    });

    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut();
        const loadSpy = jest.spyOn(
            loadAccountByEmailRepositorySpy,
            'loadByEmail'
        );
        await sut.add(mockAddAccountParams());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});
