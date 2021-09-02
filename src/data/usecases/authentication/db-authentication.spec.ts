import { AuthenticationModel } from './../../../domain/usecases/authentication';
/* eslint-disable @typescript-eslint/brace-style */
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from './../../../domain/models/account';
import { DbAuthentication } from './db-authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
describe('DbAuthentication', () => {
    interface SutTypes {
        sut: DbAuthentication;
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
        hashComparerStub: HashComparer;
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

    const makeLoadAccountByEmailRepositoryStub =
        (): LoadAccountByEmailRepository => {
            class LoadAccountByEmailRepositoryStub
                implements LoadAccountByEmailRepository
            {
                async load(email: string): Promise<AccountModel> {
                    return new Promise((resolve) => resolve(makeFakeAccount()));
                }
            }

            return new LoadAccountByEmailRepositoryStub();
        };

    const makeSut = (): SutTypes => {
        const loadAccountByEmailRepositoryStub =
            makeLoadAccountByEmailRepositoryStub();
        const hashComparerStub = makeHashCompareStub();
        const sut = new DbAuthentication(
            loadAccountByEmailRepositoryStub,
            hashComparerStub
        );

        return {
            sut,
            loadAccountByEmailRepositoryStub,
            hashComparerStub
        };
    };

    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
        await sut.auth(makeFakeAuthentication());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load'
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

    it('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load'
        ).mockReturnValueOnce(new Promise((resolve) => resolve('')));
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
});
