/* eslint-disable @typescript-eslint/no-floating-promises */
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import {
    mockSaveSurveyResultParams,
    mockSurveyResultModel,
    throwError
} from '@/domain/test';
import { mockSaveSurveyResultRepository } from '@/data/test';
import { mockLoadSurveyResultRepository } from '@/data/test/mock-db-load-survey-result';

import { DbSaveSurveyResult } from './db-save-survey-result';
import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols';

import mockDate from 'mockdate';

type SutTypes = {
    sut: DbSaveSurveyResult;
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();

    const sut = new DbSaveSurveyResult(
        saveSurveyResultRepositoryStub,
        loadSurveyResultRepositoryStub
    );

    return {
        sut,
        saveSurveyResultRepositoryStub,
        loadSurveyResultRepositoryStub
    };
};

describe('DbSaveSurveyResult Usecase', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
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

    it('should call LoadSurveyResultRepository with correct values', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(
            loadSurveyResultRepositoryStub,
            'loadBySurveyId'
        );

        const surveyResultData = mockSaveSurveyResultParams();
        await sut.save(surveyResultData);

        expect(loadSpy).toHaveBeenCalledWith(surveyResultData.surveyId);
    });

    it('should throws if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut();
        jest.spyOn(
            loadSurveyResultRepositoryStub,
            'loadBySurveyId'
        ).mockImplementationOnce(throwError);

        const promise = sut.save(mockSaveSurveyResultParams());

        expect(promise).rejects.toThrow();
    });
});
