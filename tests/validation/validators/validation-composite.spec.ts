import { Validation } from '@/presentation/protocols/validation';
import { MissingParamError } from '@/presentation/errors';
import { ValidationComposite } from '@/validation/validators/validation-composite';

import { mockValidation } from '../mocks';

type SutTypes = {
    sut: ValidationComposite;
    validationSpys: Validation[];
};

const makeSut = (): SutTypes => {
    const validationSpys = [mockValidation(), mockValidation()];
    const sut = new ValidationComposite(validationSpys);
    return {
        sut,
        validationSpys
    };
};

describe('Validation Composite', () => {
    it('should return an error if any validation fails', () => {
        const { sut, validationSpys } = makeSut();
        jest.spyOn(validationSpys[1], 'validate').mockReturnValueOnce(
            new MissingParamError('field')
        );
        const error = sut.validate({ field: 'any_value' });
        expect(error).toEqual(new MissingParamError('field'));
    });

    it('should return the first error if more then one validation fails', () => {
        const { sut, validationSpys } = makeSut();
        jest.spyOn(validationSpys[0], 'validate').mockReturnValueOnce(
            new Error()
        );
        jest.spyOn(validationSpys[1], 'validate').mockReturnValueOnce(
            new MissingParamError('field')
        );
        const error = sut.validate({ field: 'any_value' });
        expect(error).toEqual(new Error());
    });

    it('should not return if validation succeeds', () => {
        const { sut } = makeSut();
        const error = sut.validate({ field: 'any_value' });
        expect(error).toBeFalsy();
    });
});
