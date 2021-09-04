import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
    sign: async (): Promise<string> => {
        return new Promise((resolve) => resolve('any_token'));
    }
}));
describe('Jwt Adapter', () => {
    interface SutTypes {
        sut: JwtAdapter;
    }

    const makeSut = (): SutTypes => {
        const sut = new JwtAdapter('secret');
        return {
            sut
        };
    };

    it('should call sign with correct values', async () => {
        const { sut } = makeSut();
        const signSpy = jest.spyOn(jwt, 'sign');
        await sut.encrypt('any_id');
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return a valid token on success', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.encrypt('any_id');
        expect(accessToken).toBe('any_token');
    });

    it('should throws if sign throws', async () => {
        const { sut } = makeSut();
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error();
        });

        const promise = sut.encrypt('any_id');

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        expect(promise).rejects.toThrow();
    });
});
