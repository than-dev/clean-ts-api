import { mockLoadSurveyByIdRepository } from '@/data/test';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveyResultController } from './load-survey-result-controller';
import {
    HttpRequest,
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

        const response = await sut.handle(mockRequest());

        expect(response).toEqual(serverError(new Error()));
    });
});
