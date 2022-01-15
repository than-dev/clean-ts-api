import { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
    class ValidationSpy implements Validation {
        validate(input: any): Error {
            return null;
        }
    }
    return new ValidationSpy();
};
