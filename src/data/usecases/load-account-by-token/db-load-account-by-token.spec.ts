import { DbLoadAccountByToken } from './db-load-account-by-token';
import { Decrypter } from '../../../data/protocols/criptography/decrypter';

describe('DbLoadAccountByToken Usecase', () => {
    interface SutTypes {
        sut: DbLoadAccountByToken;
        decrypterStub: Decrypter;
    }

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
        const sut = new DbLoadAccountByToken(decrypterStub);

        return {
            sut,
            decrypterStub
        };
    };

    it('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut();
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

        await sut.load('any_token');

        expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });
});
