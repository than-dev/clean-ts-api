import { SignUpController } from './signup-controller';
import {
    AccountModel,
    AddAccountModel,
    AddAccount,
    Validation
} from './signup-controller-protocols';
import { MissingParamError, ServerError } from '../../errors';
import { HttpRequest } from '../../protocols';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';

interface SutTypes {
    sut: SignUpController;
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
    const addAccountStub = makeAddAccount();
    const validationStub = makeValidation();
    const sut = new SignUpController(addAccountStub, validationStub);

    return {
        sut,
        addAccountStub,
        validationStub
    };
};

describe('SignUp Controller', () => {
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
