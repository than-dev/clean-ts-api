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
        decrypterStub: Decrypter;
        loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
    };

    const makeSut = (): SutTypes => {
        const decrypterStub = mockDecrypter();
        const loadAccountByTokenRepositoryStub =
            mockLoadAccountByTokenRepository();
        const sut = new DbLoadAccountByToken(
            decrypterStub,
            loadAccountByTokenRepositoryStub
        );

        return {
            sut,
            decrypterStub,
            loadAccountByTokenRepositoryStub
        };
    };

    it('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut();
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

        await sut.loadByToken('any_token');

        expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    it('should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut();
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const account = await sut.loadByToken('any_token');

        expect(account).toBeNull();
    });

    it('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        const loadByTokenSpy = jest.spyOn(
            loadAccountByTokenRepositoryStub,
            'loadByToken'
        );

        await sut.loadByToken('any_token', 'any_role');

        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByTokenRepositoryStub,
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
        const { sut, decrypterStub } = makeSut();

        jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });

    it('should throws if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();

        jest.spyOn(
            loadAccountByTokenRepositoryStub,
            'loadByToken'
        ).mockImplementationOnce(throwError);

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });
});
