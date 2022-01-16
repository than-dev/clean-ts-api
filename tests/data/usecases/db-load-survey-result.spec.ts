/* eslint-disable @typescript-eslint/no-floating-promises */
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { mockLoadSurveyResultRepository } from '@/tests/data/mocks/mock-db-load-survey-result';
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { mockSurveyResultModel } from '@/tests/domain/mocks';
import { throwError } from '@/tests/domain/mocks/test-helpers';

import { mockLoadSurveyByIdRepository } from '../mocks';

import mockDate from 'mockdate';

type SutTypes = {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositorySpy: LoadSurveyResultRepository;
    loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository();
    const loadSurveyByIdRepositorySpy = mockLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyResult(
        loadSurveyResultRepositorySpy,
        loadSurveyByIdRepositorySpy
    );

    return {
        sut,
        loadSurveyResultRepositorySpy,
        loadSurveyByIdRepositorySpy
    };
};

describe('DbLoadSurveyResult UseCase', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call LoadSurveyResultRepository with correct values', async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut();
        const loadBySurveyIdSpy = jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        );

        await sut.load('any_survey_id');

        expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
    });

    it('should throws if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut();
        jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        ).mockImplementationOnce(throwError);

        const promise = sut.load('any_survey_id');

        expect(promise).rejects.toThrow();
    });

    it('should return surveyResultModel on success', async () => {
        const { sut } = makeSut();
        const surveyResult = await sut.load('any_survey_id');

        expect(surveyResult).toEqual(mockSurveyResultModel());
    });

    it('should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null ', async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut();

        jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        ).mockReturnValueOnce(Promise.resolve(null));

        const surveyResult = await sut.load('any_id');

        expect(surveyResult).toEqual(mockSurveyResultModel());
    });

    it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null ', async () => {
        const {
            sut,
            loadSurveyResultRepositorySpy,
            loadSurveyByIdRepositorySpy
        } = makeSut();

        jest.spyOn(
            loadSurveyResultRepositorySpy,
            'loadBySurveyId'
        ).mockReturnValueOnce(Promise.resolve(null));

        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');

        await sut.load('any_survey_id');

        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
    });
});
