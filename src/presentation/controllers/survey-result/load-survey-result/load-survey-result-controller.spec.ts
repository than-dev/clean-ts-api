import { mockLoadSurveyByIdRepository } from '@/data/test';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { HttpRequest } from './load-survey-result-controller-protocols';

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
});
