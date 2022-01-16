import {
    ok,
    forbidden,
    badRequest,
    serverError
} from '@/presentation/helpers/http/http-helper';
import {
    ServerError,
    EmailInUseError,
    MissingParamError
} from '@/presentation/errors';
import {
    mockAddAccount,
    mockValidation,
    mockAuthentication
} from '@/tests/presentation/mocks';
import { AddAccount } from '@/presentation/controllers/login/signup/signup-controller-protocols';
import { throwError } from '@/tests/domain/mocks';
import { Authentication } from '@/presentation/controllers/login/login/login-controller-protocols';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { HttpRequest, Validation } from '@/presentation/protocols';

const mockRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});

type SutTypes = {
    sut: SignUpController;
    addAccountSpy: AddAccount;
    validationSpy: Validation;
    authenticationSpy: Authentication;
};

const makeSut = (): SutTypes => {
    const authenticationSpy = mockAuthentication();
    const addAccountSpy = mockAddAccount();
    const validationSpy = mockValidation();
    const sut = new SignUpController(
        addAccountSpy,
        validationSpy,
        authenticationSpy
    );
    return {
        sut,
        addAccountSpy,
        validationSpy,
        authenticationSpy
    };
};

describe('SignUp Controller', () => {
    it('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountSpy } = makeSut();
        jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()));
        });
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    it('should call AddAccount with correct values', async () => {
        const { sut, addAccountSpy } = makeSut();
        const addSpy = jest.spyOn(addAccountSpy, 'add');
        await sut.handle(mockRequest());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });

    it('should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountSpy } = makeSut();
        jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(
            Promise.resolve(null)
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
    });

    it('should return 200 if valid data is provided', async () => {
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

    it('should call Authentication with correct values', async () => {
        const { sut, authenticationSpy } = makeSut();
        const authSpy = jest.spyOn(authenticationSpy, 'auth');
        await sut.handle(mockRequest());
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });

    it('should return 500 if Authentication throws', async () => {
        const { sut, authenticationSpy } = makeSut();
        jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(
            throwError
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
