import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

interface SutTypes {
    sut: BcryptAdapter;
}

// const makeBcryptAdapter = () => {

// }

const makeSut = (): SutTypes => {
    const sut = new BcryptAdapter(12);

    return {
        sut
    };
};

describe('DbAddAccount Usecase', () => {
    it('should call bcrypt with correct value', async () => {
        const salt = 12;
        const { sut } = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await sut.encrypt('any_value');
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
});
