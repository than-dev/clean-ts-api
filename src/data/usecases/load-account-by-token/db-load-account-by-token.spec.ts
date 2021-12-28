/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/brace-style */
import { Decrypter } from '../../../data/protocols/criptography/decrypter';
import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from './db-load-account-by-token';

describe('DbLoadAccountByToken Usecase', () => {
    type SutTypes = {
        sut: DbLoadAccountByToken;
        decrypterStub: Decrypter;
        loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
    };

    const makeFakeAccount = (): AccountModel => ({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
    });

    const makeLoadAccountByTokenRepositoryStub =
        (): LoadAccountByTokenRepository => {
            class LoadAccountByTokenRepositoryStub
                implements LoadAccountByTokenRepository
            {
                async loadByToken(
                    token: string,
                    role?: string
                ): Promise<AccountModel> {
                    return new Promise((resolve) => resolve(makeFakeAccount()));
                }
            }

            return new LoadAccountByTokenRepositoryStub();
        };

    const makeDecrypterStub = (): Decrypter => {
        class DecrypterStub implements Decrypter {
            async decrypt(token: string): Promise<string> {
                return new Promise((resolve) => resolve('any_value'));
            }
        }

        return new DecrypterStub();
    };

    const makeSut = (): SutTypes => {
        const decrypterStub = makeDecrypterStub();
        const loadAccountByTokenRepositoryStub =
            makeLoadAccountByTokenRepositoryStub();
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
            new Promise((resolve) => resolve(null))
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
        ).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

        const account = await sut.loadByToken('any_token');

        expect(account).toBeNull();
    });

    it('should return an account on success', async () => {
        const { sut } = makeSut();

        const account = await sut.loadByToken('any_token');

        expect(account).toEqual(makeFakeAccount());
    });

    it('should throws if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut();

        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });

    it('should throws if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();

        jest.spyOn(
            loadAccountByTokenRepositoryStub,
            'loadByToken'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.loadByToken('any_token');

        expect(promise).rejects.toThrow();
    });
});
