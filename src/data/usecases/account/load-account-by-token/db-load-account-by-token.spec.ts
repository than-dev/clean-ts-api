/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/brace-style */
import { Decrypter } from '../../../protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { mockAccountModel, throwError } from '@/domain/test';
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test';

describe('DbLoadAccountByToken Usecase', () => {
    type SutTypes = {
        sut: DbLoadAccountByToken;
        decrypterSpy: Decrypter;
        loadAccountByTokenRepositorySpy: LoadAccountByTokenRepository;
    };

    const makeSut = (): SutTypes => {
        const decrypterSpy = mockDecrypter();
        const loadAccountByTokenRepositorySpy =
            mockLoadAccountByTokenRepository();
        const sut = new DbLoadAccountByToken(
            decrypterSpy,
            loadAccountByTokenRepositorySpy
        );

        return {
            sut,
            decrypterSpy,
            loadAccountByTokenRepositorySpy
        };
    };

    it('should call Decrypter with correct values', async () => {
        const { sut, decrypterSpy } = makeSut();
        const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt');

        await sut.loadByToken('any_token');

        expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    it('should return null if Decrypter returns null', async () => {
        const { sut, decrypterSpy } = makeSut();
        jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const account = await sut.loadByToken('any_token');

        expect(account).toBeNull();
    });

    it('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut();
        const loadByTokenSpy = jest.spyOn(
            loadAccountByTokenRepositorySpy,
            'loadByToken'
        );

        await sut.loadByToken('any_token', 'any_role');

        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut();
        jest.spyOn(
            loadAccountByTokenRepositorySpy,
            'loadByToken'
        ).mockReturnValueOnce(Promise.resolve(null));

        const account = await sut.loadByToken('any_token');

        expect(account).toBeNull();
    });

    it('should return an account on success', async () => {
        const { sut } = makeSut();

        const account = await sut.loadByToken('any_token');

        expect(account).toEqual(mockAccountModel());
    });

    it('should throws if Decrypter throws', async () => {
        const { sut, decrypterSpy } = makeSut();

        jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });

    it('should throws if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut();

        jest.spyOn(
            loadAccountByTokenRepositorySpy,
            'loadByToken'
        ).mockImplementationOnce(throwError);

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });
});
