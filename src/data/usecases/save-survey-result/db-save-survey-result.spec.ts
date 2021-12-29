/* eslint-disable @typescript-eslint/no-floating-promises */
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';
import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';

type SutTypes = {
    sut: DbSaveSurveyResult;
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
});

const makeFakeSurveyResult = (): SurveyResultModel =>
    Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' });

const makeAddSurveyRepositoryStub = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return new Promise((resolve) => resolve(makeFakeSurveyResult()));
        }
    }

    return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeAddSurveyRepositoryStub();
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

    return {
        sut,
        saveSurveyResultRepositoryStub
    };
};

describe('DbSaveSurveyResult Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date());
    });

    afterAll(() => {
        MockDate.reset();
    });

    it('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut();
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

        const surveyResultData = makeFakeSurveyResultData();
        await sut.save(surveyResultData);

        expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
    });

    it('should throws if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut();
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.save(makeFakeSurveyResultData());

        expect(promise).rejects.toThrow();
    });

    it('should return a SurveyResult on success', async () => {
        const { sut } = makeSut();

        const surveyResultData = makeFakeSurveyResultData();
        const survey = await sut.save(surveyResultData);

        expect(survey).toEqual(makeFakeSurveyResult());
    });
});
