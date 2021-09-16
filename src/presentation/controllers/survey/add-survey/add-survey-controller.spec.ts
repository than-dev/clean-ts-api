import { HttpRequest, Validation } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest } from '../../../helpers/http/http-helper';

describe('Add Survey Controller', () => {
    interface SutTypes {
        sut: AddSurveyController;
        validationStub: Validation;
    }

    const makeFakeRequest = (): HttpRequest => ({
        body: {
            question: 'any_question',
            answers: [
                {
                    image: 'any_img',
                    answer: 'any_answer'
                }
            ]
        }
    });

    const makeValidationStub = (): Validation => {
        class ValidationStub implements Validation {
            validate(input: any): Error {
                return null;
            }
        }

        return new ValidationStub();
    };

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub();
        const sut = new AddSurveyController(validationStub);

        return {
            sut,
            validationStub
        };
    };

    it('should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = makeFakeRequest();
        await sut.handle(httpRequest);

        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 400 if validation fails', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

        const httpRequest = makeFakeRequest();
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse).toEqual(badRequest(new Error()));
    });
});
