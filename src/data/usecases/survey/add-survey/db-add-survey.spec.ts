/* eslint-disable @typescript-eslint/no-floating-promises */
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from './db-add-survey-protocols';
import { mockSurveyModel, throwError } from '@/domain/test';

import mockDate from 'mockdate';
import { mockAddSurveyRepository } from '@/data/test';

type SutTypes = {
    sut: DbAddSurvey;
    addSurveyRepositorySpy: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
    const addSurveyRepositorySpy = mockAddSurveyRepository();
    const sut = new DbAddSurvey(addSurveyRepositorySpy);

    return {
        sut,
        addSurveyRepositorySpy
    };
};

describe('DbAddSurvey Usecase', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositorySpy } = makeSut();
        const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add');

        const surveyData = mockSurveyModel();
        await sut.add(surveyData);

        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });

    it('should throws if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositorySpy } = makeSut();
        jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(
            throwError
        );

        const promise = sut.add(mockSurveyModel());

        expect(promise).rejects.toThrow();
    });
});
