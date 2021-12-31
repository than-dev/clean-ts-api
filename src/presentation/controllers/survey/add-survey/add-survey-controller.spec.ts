import {
    AddSurvey,
    AddSurveyParams,
    HttpRequest,
    Validation
} from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import {
    badRequest,
    noContent,
    serverError
} from '../../../helpers/http/http-helper';
import { throwError } from '@/domain/test/';

import makeFakeDate from 'mockdate';

type SutTypes = {
    sut: AddSurveyController;
    validationStub: Validation;
    addSurveyStub: AddSurvey;
};

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            {
                image: 'any_img',
                answer: 'any_answer'
            }
        ],
        date: new Date()
    }
});

const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyParams): Promise<void> {
            return new Promise((resolve) => resolve());
        }
    }

    return new AddSurveyStub();
};

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
    const addSurveyStub = makeAddSurveyStub();
    const sut = new AddSurveyController(validationStub, addSurveyStub);

    return {
        sut,
        validationStub,
        addSurveyStub
    };
};

describe('Add Survey Controller', () => {
    beforeAll(() => {
        makeFakeDate.set(new Date());
    });

    afterAll(() => {
        makeFakeDate.reset();
    });

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

    it('should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyStub, 'add');

        const httpRequest = makeFakeRequest();
        await sut.handle(httpRequest);

        expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 500 if AddSurvey throws', async () => {
        const { sut, addSurveyStub } = makeSut();
        jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 204 if on success', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(noContent());
    });
});
