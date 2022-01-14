import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
        async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel());
        }
    }

    return new LoadSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub();
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
