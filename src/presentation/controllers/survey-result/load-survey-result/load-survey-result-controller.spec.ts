import { mockLoadSurveyByIdRepository } from '@/data/test';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { HttpRequest } from '@/presentation/protocols/http';
import { LoadSurveyResultController } from './load-survey-result-controller';
import {
    forbidden,
    InvalidParamError,
    serverError
} from './load-survey-result-controller-protocols';

type SutTypes = {
    sut: LoadSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
};

const mockRequest = (): HttpRequest => ({
    body: {
        surveyId: 'any_survey_id'
    }
});

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyByIdRepository();
    const sut = new LoadSurveyResultController(loadSurveyByIdStub);

    return {
        sut,
        loadSurveyByIdStub
    };
};

describe('LoadSurveyResult Controller', () => {
    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

        const request = mockRequest();

        await sut.handle(request);

        expect(loadSurveyByIdSpy).toHaveBeenCalledWith(request.body.surveyId);
    });

    it('should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
            Promise.reject(new Error())
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });

    // it('should return 200 on success', async () => {
    //     const { sut } = makeSut();

    //     const httpResponse = await sut.handle(mockRequest());

    //     expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
    // });
});
