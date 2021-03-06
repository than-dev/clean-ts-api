import { Validation } from '@/presentation/protocols/validation';
import { EmailValidator } from '@/validation/protocols/email-validator';
import {
    RequiredFieldValidation,
    CompareFieldsValidation,
    EmailValidation,
    ValidationComposite
} from '@/validation/validators';
import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';

jest.mock('@/validation/validators/validation-composite.ts');

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorSpy implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorSpy();
};

describe('SignUpValidation Factory', () => {
    it('should call ValidationComposite with all validations', () => {
        makeSignUpValidation();
        const validations: Validation[] = [];
        for (const field of [
            'name',
            'email',
            'password',
            'passwordConfirmation'
        ]) {
            validations.push(new RequiredFieldValidation(field));
        }
        validations.push(
            new CompareFieldsValidation('password', 'passwordConfirmation')
        );
        validations.push(new EmailValidation('email', makeEmailValidator()));
        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
