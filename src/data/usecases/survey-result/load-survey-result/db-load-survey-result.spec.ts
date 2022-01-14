import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { mockLoadSurveyResultRepositoryStub } from '@/data/test/mock-db-load-survey-result';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepositoryStub();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);

    return {
        sut,
        loadSurveyResultRepositoryStub
    };
};

describe('DbLoadSurveyResult UseCase', () => {
    it('should call LoadSurveyResultRepository with correct values', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut();
        const loadBySurveyIdSpy = jest.spyOn(
            loadSurveyResultRepositoryStub,
            'loadBySurveyId'
        );

        await sut.load('any_survey_id');

        expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
    });
});
