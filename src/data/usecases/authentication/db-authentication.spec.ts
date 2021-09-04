/* eslint-disable @typescript-eslint/brace-style */
import { DbAuthentication } from './db-authentication';
import {
    AccountModel,
    AuthenticationModel,
    HashComparer,
    Encrypter,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from './db-authentication-protocols';

describe('DbAuthentication UseCase', () => {
    interface SutTypes {
        sut: DbAuthentication;
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
        hashComparerStub: HashComparer;
        encrypterStub: Encrypter;
        updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
    }

    const makeFakeAuthentication = (): AuthenticationModel => ({
        email: 'any_email@mail.com',
        password: 'any_password'
    });

    const makeFakeAccount = (): AccountModel => ({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
    });

    const makeHashCompareStub = (): HashComparer => {
        class LoadAccountByEmailRepositoryStub implements HashComparer {
            async compare(value: string, hash: string): Promise<boolean> {
                return new Promise((resolve) => resolve(true));
            }
        }

        return new LoadAccountByEmailRepositoryStub();
    };

    const makeEncrypterStub = (): Encrypter => {
        class EncrypterStub implements Encrypter {
            async encrypt(id: string): Promise<string> {
                return new Promise((resolve) => resolve('any_token'));
            }
        }

        return new EncrypterStub();
    };

    const makeUpdateAccessTokenRepositoryStub =
        (): UpdateAccessTokenRepository => {
            class UpdateAccessTokenRepositoryStub
                implements UpdateAccessTokenRepository
            {
                async updateAccessToken(
                    id: string,
                    token: string
                ): Promise<void> {
                    return new Promise((resolve) => resolve());
                }
            }

            return new UpdateAccessTokenRepositoryStub();
        };

    const makeLoadAccountByEmailRepositoryStub =
        (): LoadAccountByEmailRepository => {
            class LoadAccountByEmailRepositoryStub
                implements LoadAccountByEmailRepository
            {
                async loadByEmail(email: string): Promise<AccountModel> {
                    return new Promise((resolve) => resolve(makeFakeAccount()));
                }
            }

            return new LoadAccountByEmailRepositoryStub();
        };

    const makeSut = (): SutTypes => {
        const loadAccountByEmailRepositoryStub =
            makeLoadAccountByEmailRepositoryStub();
        const hashComparerStub = makeHashCompareStub();
        const encrypterStub = makeEncrypterStub();
        const updateAccessTokenRepositoryStub =
            makeUpdateAccessTokenRepositoryStub();
        const sut = new DbAuthentication(
            loadAccountByEmailRepositoryStub,
            hashComparerStub,
            encrypterStub,
            updateAccessTokenRepositoryStub
        );

        return {
            sut,
            loadAccountByEmailRepositoryStub,
            hashComparerStub,
            encrypterStub,
            updateAccessTokenRepositoryStub
        };
    };

    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadByEmailSpy = jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        );
        await sut.auth(makeFakeAuthentication());
        expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should throw if HashCompare throws', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });

    // it('should return null if LoadAccountByEmailRepository returns null', async () => {
    //     const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    //     jest.spyOn(
    //         loadAccountByEmailRepositoryStub,
    //         'loadByEmail'
    //     ).mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    //     const accessToken = await sut.auth(makeFakeAuthentication());
    //     expect(accessToken).toBeFalsy();
    // });

    it('should return null if HashCompare returns false', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((resolve) => resolve(false))
        );
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBeFalsy();
    });

    it('should call HashCompare with correct values', async () => {
        const { sut, hashComparerStub } = makeSut();
        const compareSpy = jest.spyOn(hashComparerStub, 'compare');
        await sut.auth(makeFakeAuthentication());
        expect(compareSpy).toHaveBeenCalledWith(
            'any_password',
            'hashed_password'
        );
    });

    it('should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        await sut.auth(makeFakeAuthentication());
        expect(encryptSpy).toHaveBeenCalledWith('any_id');
    });

    it('should return token on success', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBe('any_token');
    });

    it('should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const updateAccessTokenSpy = jest.spyOn(
            updateAccessTokenRepositoryStub,
            'updateAccessToken'
        );
        await sut.auth(makeFakeAuthentication());
        expect(updateAccessTokenSpy).toHaveBeenCalledWith(
            'any_id',
            'any_token'
        );
    });

    it('should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        jest.spyOn(
            updateAccessTokenRepositoryStub,
            'updateAccessToken'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });
});
