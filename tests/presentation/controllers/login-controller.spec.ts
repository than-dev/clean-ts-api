import {
    unauthorized,
    serverError,
    ok,
    badRequest
} from '@/presentation/helpers/http/http-helper';
import { throwError } from '@/tests/domain/mocks';
import { Authentication } from '@/presentation/controllers/login/login/login-controller-protocols';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { mockAuthentication, mockValidation } from '@/tests/presentation/mocks';

const mockRequest = (): LoginController.Request => ({
    email: 'any_email@mail.com',
    password: 'any_password'
});

type SutTypes = {
    sut: LoginController;
    authenticationSpy: Authentication;
    validationSpy: Validation;
};

const makeSut = (): SutTypes => {
    const authenticationSpy = mockAuthentication();
    const validationSpy = mockValidation();
    const sut = new LoginController(authenticationSpy, validationSpy);
    return {
        sut,
        authenticationSpy,
        validationSpy
    };
};

describe('Login Controller', () => {
    it('should call Authentication with correct values', async () => {
        const { sut, authenticationSpy } = makeSut();
        const authSpy = jest.spyOn(authenticationSpy, 'auth');
        await sut.handle(mockRequest());
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });

    it('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationSpy } = makeSut();
        jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(unauthorized());
    });

    it('should return 500 if Authentication throws', async () => {
        const { sut, authenticationSpy } = makeSut();
        jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(
            throwError
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
    });

    it('should call Validation with correct value', async () => {
        const { sut, validationSpy } = makeSut();
        const validateSpy = jest.spyOn(validationSpy, 'validate');

        const request = mockRequest();
        await sut.handle(request);

        expect(validateSpy).toHaveBeenCalledWith(request);
    });

    it('should return 400 if Validation returns an error', async () => {
        const { sut, validationSpy } = makeSut();
        jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field')
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('any_field'))
        );
    });
});
