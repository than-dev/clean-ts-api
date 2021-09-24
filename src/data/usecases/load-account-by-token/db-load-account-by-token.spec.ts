/* eslint-disable @typescript-eslint/brace-style */
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { Decrypter } from '../../../data/protocols/criptography/decrypter';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

describe('DbLoadAccountByToken Usecase', () => {
    interface SutTypes {
        sut: DbLoadAccountByToken;
        decrypterStub: Decrypter;
        loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
    }

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
            async decrypt(value: string): Promise<string> {
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

        await sut.load('any_token');

        expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    it('should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut();
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
            new Promise((resolve) => resolve(null))
        );

        const account = await sut.load('any_token');

        expect(account).toBeNull();
    });

    it('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        const loadByTokenSpy = jest.spyOn(
            loadAccountByTokenRepositoryStub,
            'loadByToken'
        );

        await sut.load('any_token', 'any_role');

        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByTokenRepositoryStub,
            'loadByToken'
        ).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

        const account = await sut.load('any_token');

        expect(account).toBeNull();
    });
});
