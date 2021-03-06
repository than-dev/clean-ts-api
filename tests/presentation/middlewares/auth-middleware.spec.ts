import {
    ok,
    forbidden,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { throwError } from '@/tests/domain/mocks';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import { LoadAccountByToken } from '@/presentation/middlewares/auth-middleware-protocols';
import { mockLoadAccountByTokenRepository } from '@/tests/data/mocks';

type SutTypes = {
    sut: AuthMiddleware;
    loadAccountByTokenSpy: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenSpy = mockLoadAccountByTokenRepository();
    const sut = new AuthMiddleware(loadAccountByTokenSpy, role);

    return {
        sut,
        loadAccountByTokenSpy
    };
};

const mockRequest = (): AuthMiddleware.Request => ({
    accessToken: 'any_token'
});

describe('Auth Middleware', () => {
    it('should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    it('should call LoadAccountByToken with correct accessToken', async () => {
        const role = 'any_role';
        const { sut, loadAccountByTokenSpy } = makeSut(role);

        const loadSpy = jest.spyOn(loadAccountByTokenSpy, 'loadByToken');

        await sut.handle(mockRequest());

        expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenSpy } = makeSut();

        jest.spyOn(loadAccountByTokenSpy, 'loadByToken').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    it('should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
    });

    it('should return 500 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenSpy } = makeSut();

        jest.spyOn(loadAccountByTokenSpy, 'loadByToken').mockImplementationOnce(
            throwError
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
