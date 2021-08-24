import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve('hash'));
    }
}));

// const makeBcryptAdapter = () => {

// }

const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter(salt);

    return sut;
};

describe('DbAddAccount Usecase', () => {
    it('should call bcrypt with correct value', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await sut.encrypt('any_value');
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return a hash on success', async () => {
        const sut = makeSut();

        const hash = await sut.encrypt('any_value');
        expect(hash).toBe('hash');
    });
});
