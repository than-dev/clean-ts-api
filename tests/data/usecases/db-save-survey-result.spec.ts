/* eslint-disable @typescript-eslint/no-floating-promises */
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import {
    mockSaveSurveyResultParams,
    mockSurveyResultModel,
    throwError
} from '@/tests/domain/mocks';
import {
    mockSaveSurveyResultRepository,
    mockLoadSurveyResultRepository
} from '@/tests/data/mocks';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result';

import mockDate from 'mockdate';

type SutTypes = {
    sut: DbSaveSurveyResult;
    saveSurveyResultRepositorySpy: SaveSurveyResultRepository;
    loadSurveyResultRepositorySpy: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositorySpy = mockSaveSurveyResultRepository();
    const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository();

    const sut = new DbSaveSurveyResult(
        saveSurveyResultRepositorySpy,
        loadSurveyResultRepositorySpy
    );

    return {
        sut,
        saveSurveyResultRepositorySpy,
        loadSurveyResultRepositorySpy
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
        const { sut, saveSurveyResultRepositorySpy } = makeSut();
        const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save');

        const surveyResultData = mockSaveSurveyResultParams();
        await sut.save(surveyResultData);

        expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
    });

    it('should throws if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositorySpy } = makeSut();
        jest.spyOn(
            saveSurveyResultRepositorySpy,
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
        const { sut, loadSurveyResultRepositorySpy } = makeSut();
        const loadSpy = jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        );

        const surveyResultData = mockSaveSurveyResultParams();
        await sut.save(surveyResultData);

        expect(loadSpy).toHaveBeenCalledWith(surveyResultData.surveyId);
    });

    it('should throws if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut();
        jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        ).mockImplementationOnce(throwError);

        const promise = sut.save(mockSaveSurveyResultParams());

        expect(promise).rejects.toThrow();
    });
});
