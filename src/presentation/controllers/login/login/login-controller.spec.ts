import { LoginController } from './login-controller';
import {
    badRequest,
    serverError,
    unauthorized,
    ok
} from '../../../helpers/http/http-helper';
import {
    HttpRequest,
    Authentication,
    Validation
} from './login-controller-protocols';
import { MissingParamError } from '../../../errors';
import { throwError } from '@/domain/test';
import { mockAuthentication, mockValidation } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password'
    }
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
        const httpRequest = mockRequest();
        await sut.handle(httpRequest);
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
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
