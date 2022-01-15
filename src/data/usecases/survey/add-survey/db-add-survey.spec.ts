/* eslint-disable @typescript-eslint/no-floating-promises */
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from './db-add-survey-protocols';
import { mockSurveyModel, throwError } from '@/domain/test';

import mockDate from 'mockdate';
import { mockAddSurveyRepository } from '@/data/test';

type SutTypes = {
    sut: DbAddSurvey;
    addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = mockAddSurveyRepository();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);

    return {
        sut,
        addSurveyRepositoryStub
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
        const { sut, addSurveyRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

        const surveyData = mockSurveyModel();
        await sut.add(surveyData);

        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });

    it('should throws if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(
            throwError
        );

        const promise = sut.add(mockSurveyModel());

        expect(promise).rejects.toThrow();
    });
});
