/* eslint-disable @typescript-eslint/no-floating-promises */
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
    mockSaveSurveyResultParams,
    mockSurveyResultModel,
    throwError
} from '@/domain/test';

import makeFakeDate from 'mockdate';
import { mockSaveSurveyResultRepository } from '@/data/test';

type SutTypes = {
    sut: DbSaveSurveyResult;
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

    return {
        sut,
        saveSurveyResultRepositoryStub
    };
};

describe('DbSaveSurveyResult Usecase', () => {
    beforeAll(() => {
        makeFakeDate.set(new Date());
    });

    afterAll(() => {
        makeFakeDate.reset();
    });

    it('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut();
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

        const surveyResultData = mockSaveSurveyResultParams();
        await sut.save(surveyResultData);

        expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
    });

    it('should throws if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut();
        jest.spyOn(
            saveSurveyResultRepositoryStub,
            'save'
        ).mockImplementationOnce(throwError);

        const promise = sut.save(mockSaveSurveyResultParams());

        expect(promise).rejects.toThrow();
    });

    it('should return a SurveyResult on success', async () => {
        const { sut } = makeSut();

        const surveyResultData = mockSaveSurveyResultParams();
        const survey = await sut.save(surveyResultData);

        expect(survey).toEqual(mockSurveyResultModel());
    });
});
