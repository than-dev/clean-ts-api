import { SignUpController } from './signup';
import {
    EmailValidator,
    AccountModel,
    AddAccountModel,
    AddAccount,
    Validation
} from './signup-protocols';
import {
    MissingParamError,
    InvalidParamError,
    ServerError
} from '../../errors';
import { HttpRequest } from '../../protocols';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
    validationStub: Validation;
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
});

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error | null {
            return null;
        }
    }

    return new ValidationStub();
};

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return await new Promise((resolve) => resolve(makeFakeAccount()));
        }
    }

    return new AddAccountStub();
};

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const validationStub = makeValidation();
    const sut = new SignUpController(
        emailValidatorStub,
        addAccountStub,
        validationStub
    );

    return {
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub
    };
};

describe('SignUp Controller', () => {
    it('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                email: 'invalid_email'
            }
        };

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email'))
        );
    });

    it('should call emailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        await sut.handle(makeFakeRequest());

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should return 500 if emailValidator throws an exception', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new ServerError()));
    });

    it('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');

        await sut.handle(makeFakeRequest());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });

    it('should return 500 if AddAccount throws an exception', async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new ServerError()));
    });

    it('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = makeFakeRequest();
        await sut.handle(httpRequest);

        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });

    it('should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field')
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('any_field'))
        );
    });
});
