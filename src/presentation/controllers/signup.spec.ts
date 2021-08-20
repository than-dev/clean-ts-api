import { SignUpController } from './signup';
import { EmailValidator } from '../protocols/email-validator';
import { MissingParamError, InvalidParamError, ServerError } from '../errors/';

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return false;
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    return {
        sut,
        emailValidatorStub
    };
};

describe('SignUp Controller', () => {
    it('should return 400 if no name is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    it('should return 400 if no email is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    it('should return 400 if no password is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    it('should return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                email: 'any_email@mail.com'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new MissingParamError('passwordConfirmation')
        );
    });

    it('should return 400 if an invalid email is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                email: 'invalid_email'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('should call emailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                email: 'any_email@mail.com'
            }
        };

        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should return 500 if emailValidator throws', () => {
        class EmailValidatorStub implements EmailValidator {
            isValid(email: string): boolean {
                throw new Error();
            }
        }

        const emailValidatorStub = new EmailValidatorStub();
        const sut = new SignUpController(emailValidatorStub);
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                email: 'any_email@mail.com'
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
});
