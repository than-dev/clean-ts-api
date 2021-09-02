import { RequiredFieldValidation } from './required-field-validation';
import { MissingParamError } from '../../errors';

describe('RequiredField Validation', () => {
    const makeSut = (): RequiredFieldValidation => {
        return new RequiredFieldValidation('field');
    };

    it('should return a MissingParamError if validation fails', () => {
        const sut = makeSut();
        const error = sut.validate({ name: 'any_name' });
        expect(error).toEqual(new MissingParamError('field'));
    });

    it('should not return if validation succeeds', () => {
        const sut = new RequiredFieldValidation('field');
        const error = sut.validate({ field: 'any_name' });
        expect(error).toBeFalsy();
    });
});
