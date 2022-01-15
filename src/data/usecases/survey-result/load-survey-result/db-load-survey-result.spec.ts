/* eslint-disable @typescript-eslint/no-floating-promises */

import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { mockLoadSurveyResultRepository } from '@/data/test/mock-db-load-survey-result';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { LoadSurveyByIdRepository } from '../../survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { mockLoadSurveyByIdRepository } from '@/data/test';

type SutTypes = {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyResult(
        loadSurveyResultRepositoryStub,
        loadSurveyByIdRepositoryStub
    );

    return {
        sut,
        loadSurveyResultRepositoryStub,
        loadSurveyByIdRepositoryStub
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

    it('should throws if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut();
        jest.spyOn(
            loadSurveyResultRepositoryStub,
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

    it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null ', async () => {
        const {
            sut,
            loadSurveyResultRepositoryStub,
            loadSurveyByIdRepositoryStub
        } = makeSut();

        jest.spyOn(
            loadSurveyResultRepositoryStub,
            'loadBySurveyId'
        ).mockReturnValueOnce(Promise.resolve(null));

        const loadByIdSpy = jest.spyOn(
            loadSurveyByIdRepositoryStub,
            'loadById'
        );

        await sut.load('any_survey_id');

        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
    });
});
