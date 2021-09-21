import { HttpRequest } from '../protocols/http';

describe('Auth Middleware', () => {
    interface SutTypes {
        sut: AuthMiddleware;
    }

    const makeFakeRequest = (): HttpRequest => ({
        headers: {}
    });

    const makeSut = (): SutTypes => {
        const sut = new AuthMiddleware();

        return {
            sut
        };
    };

    it('should return 403 if no x-access-token exists in headers', () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {};

        const httpResponse = await sut.handle();

        expect(httpResponse).toEqual(forbidden());
    });
});
