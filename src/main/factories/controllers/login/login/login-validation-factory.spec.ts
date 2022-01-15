import { makeLoginValidation } from './login-validation-factory';
import {
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite
} from '@/validation/validators';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { Validation } from '@/presentation/protocols/validation';

jest.mock('@/validation/validators/validation-composite.ts');

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorSpy implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorSpy();
};

describe('LoginValidation Factory', () => {
    it('should call ValidationComposite with all validations', () => {
        makeLoginValidation();
        const validations: Validation[] = [];
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field));
        }
        validations.push(new EmailValidation('email', makeEmailValidator()));
        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
