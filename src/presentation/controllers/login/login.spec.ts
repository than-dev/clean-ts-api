import { InvalidParamError, MissingParamError } from '../../errors';
import {
    badRequest,
    serverError,
    unauthorized
} from '../../helpers/http-helper';
import { EmailValidator, HttpRequest, Authentication } from './login-protocol';
import { LoginController } from './login';

describe('Login Controller', () => {
    interface SutTypes {
        sut: LoginController;
        emailValidatorStub: EmailValidator;
        authenticationStub: Authentication;
    }

    const makeFakeRequest = (): HttpRequest => ({
        body: {
            email: 'any_email@mail.com',
            password: 'any_valid'
        }
    });

    const makeAuthentication = (): Authentication => {
        class AuthenticatorStub implements Authentication {
            async auth(email: string, password: string): Promise<string> {
                return 'any_token';
            }
        }

        return new AuthenticatorStub();
    };

    const makeEmailValidator = (): EmailValidator => {
        class EmailValidatorStub implements EmailValidator {
            isValid(email: string): boolean {
                return true;
            }
        }

        return new EmailValidatorStub();
    };

    const makeSut = (): SutTypes => {
        const emailValidatorStub = makeEmailValidator();
        const authenticationStub = makeAuthentication();
        const sut = new LoginController(emailValidatorStub, authenticationStub);

        return {
            sut,
            emailValidatorStub,
            authenticationStub
        };
    };

    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email'))
        );
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('password'))
        );
    });

    it('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email'))
        );
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should call Authenticator with correct values', async () => {
        const { sut, authenticationStub } = makeSut();
        const isValidSpy = jest.spyOn(authenticationStub, 'auth');

        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith(
            'any_email@mail.com',
            'any_valid'
        );
    });

    it('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise((resolve) => resolve(''))
        );

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(unauthorized());
    });
});
