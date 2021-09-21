import { HttpRequest } from '../protocols/http';
import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http-helper';
import { AuthMiddleware } from './auth-middleware';

describe('Auth Middleware', () => {
    interface SutTypes {
        sut: AuthMiddleware;
    }

    const makeSut = (): SutTypes => {
        const sut = new AuthMiddleware();

        return {
            sut
        };
    };

    const makeFakeRequest = (): HttpRequest => ({
        headers: {
            'x-access-token': 'any_token'
        }
    });

    it('should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    it('should call LoadAccountByToken with correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByTokenStub, '');
        await sut.handle(makeFakeRequest());

        expect(loadSpy).toHaveBeenCalledWith('any_token');
    });
});
