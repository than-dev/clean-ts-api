import { EmailValidator } from '@/validation/protocols/email-validator';
import { EmailValidation } from '@/validation/validators/email-validation';
import { InvalidParamError } from '@/presentation/errors';

import { mockEmailValidator } from '../mocks';

type SutTypes = {
    sut: EmailValidation;
    emailValidatorSpy: EmailValidator;
};

const makeSut = (): SutTypes => {
    const emailValidatorSpy = mockEmailValidator();
    const sut = new EmailValidation('email', emailValidatorSpy);
    return {
        sut,
        emailValidatorSpy
    };
};

describe('Email Validation', () => {
    it('should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorSpy } = makeSut();
        jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false);
        const error = sut.validate({ email: 'any_email@mail.com' });
        expect(error).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', () => {
        const { sut, emailValidatorSpy } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid');
        sut.validate({ email: 'any_email@mail.com' });
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should throw if EmailValidator throws', () => {
        const { sut, emailValidatorSpy } = makeSut();
        jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.validate).toThrow();
    });
});
