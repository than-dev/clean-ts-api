import { HttpRequest } from '../protocols/http';
import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccountModel } from '../../domain/models/account';

describe('Auth Middleware', () => {
    interface SutTypes {
        sut: AuthMiddleware;
        loadAccountByTokenStub: LoadAccountByToken;
    }

    const makeSut = (role?: string): SutTypes => {
        const loadAccountByTokenStub = makeLoadAccountByTokenStub();
        const sut = new AuthMiddleware(loadAccountByTokenStub, role);

        return {
            sut,
            loadAccountByTokenStub
        };
    };

    const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
        class LoadAccountByTokenStub implements LoadAccountByToken {
            async load(
                accessToken: string,
                role?: string
            ): Promise<AccountModel> {
                return new Promise((resolve) => resolve(makeFakeAccount()));
            }
        }

        return new LoadAccountByTokenStub();
    };

    const makeFakeRequest = (): HttpRequest => ({
        headers: {
            'x-access-token': 'any_token'
        }
    });

    const makeFakeAccount = (): AccountModel => ({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
    });

    it('should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    it('should call LoadAccountByToken with correct accessToken', async () => {
        const role = 'any_role';
        const { sut, loadAccountByTokenStub } = makeSut(role);

        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

        await sut.handle(makeFakeRequest());

        expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut();

        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
            new Promise((resolve) => resolve(null))
        );

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    it('should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
    });

    it('should return 500 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut();

        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });
});