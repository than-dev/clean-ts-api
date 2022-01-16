import { mockAuthentication, throwError } from '@/tests/domain/mocks';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/usecases/account/add-account/db-add-account-protocols';
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { UpdateAccessTokenRepository } from '@/data/usecases/account/authentication/db-authentication-protocols';
import {
    mockEncrypter,
    mockHashComparer,
    mockLoadAccountByEmailRepository,
    mockUpdateAccessTokenRepository
} from '../mocks';

type SutTypes = {
    sut: DbAuthentication;
    loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository;
    hashComparerSpy: HashComparer;
    encrypterSpy: Encrypter;
    updateAccessTokenRepositorySpy: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository();
    const hashComparerSpy = mockHashComparer();
    const encrypterSpy = mockEncrypter();
    const updateAccessTokenRepositorySpy = mockUpdateAccessTokenRepository();
    const sut = new DbAuthentication(
        loadAccountByEmailRepositorySpy,
        hashComparerSpy,
        encrypterSpy,
        updateAccessTokenRepositorySpy
    );
    return {
        sut,
        loadAccountByEmailRepositorySpy,
        hashComparerSpy,
        encrypterSpy,
        updateAccessTokenRepositorySpy
    };
};

describe('DbAuthentication UseCase', () => {
    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut();
        const loadSpy = jest.spyOn(
            loadAccountByEmailRepositorySpy,
            'loadByEmail'
        );
        await sut.auth(mockAuthentication());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositorySpy,
            'loadByEmail'
        ).mockImplementationOnce(throwError);
        const promise = sut.auth(mockAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositorySpy,
            'loadByEmail'
        ).mockReturnValueOnce(null);
        const accessToken = await sut.auth(mockAuthentication());
        expect(accessToken).toBeNull();
    });

    it('should call HashComparer with correct values', async () => {
        const { sut, hashComparerSpy } = makeSut();
        const compareSpy = jest.spyOn(hashComparerSpy, 'compare');
        await sut.auth(mockAuthentication());
        expect(compareSpy).toHaveBeenCalledWith(
            'any_password',
            'hashed_password'
        );
    });

    it('should throw if HashComparer throws', async () => {
        const { sut, hashComparerSpy } = makeSut();
        jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(
            throwError
        );
        const promise = sut.auth(mockAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should return null if HashComparer returns false', async () => {
        const { sut, hashComparerSpy } = makeSut();
        jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(
            Promise.resolve(false)
        );
        const accessToken = await sut.auth(mockAuthentication());
        expect(accessToken).toBeNull();
    });

    it('should call Encrypter with correct id', async () => {
        const { sut, encrypterSpy } = makeSut();
        const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt');
        await sut.auth(mockAuthentication());
        expect(encryptSpy).toHaveBeenCalledWith('any_id');
    });

    it('should throw if Encrypter throws', async () => {
        const { sut, encrypterSpy } = makeSut();
        jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);
        const promise = sut.auth(mockAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should return a token on success', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth(mockAuthentication());
        expect(accessToken).toBe('any_token');
    });

    it('should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositorySpy } = makeSut();
        const updateSpy = jest.spyOn(
            updateAccessTokenRepositorySpy,
            'updateAccessToken'
        );
        await sut.auth(mockAuthentication());
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });

    it('should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositorySpy } = makeSut();
        jest.spyOn(
            updateAccessTokenRepositorySpy,
            'updateAccessToken'
        ).mockImplementationOnce(throwError);
        const promise = sut.auth(mockAuthentication());
        await expect(promise).rejects.toThrow();
    });
});
