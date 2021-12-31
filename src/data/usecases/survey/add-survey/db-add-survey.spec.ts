/* eslint-disable @typescript-eslint/no-floating-promises */
import { DbAddSurvey } from './db-add-survey';
import {
    AddSurveyParams,
    AddSurveyRepository
} from './db-add-survey-protocols';
import { throwError } from '@/domain/test/';

import makeFakeDate from 'mockdate';
import { mockAddSurveyRepository } from '@/data/test';

type SutTypes = {
    sut: DbAddSurvey;
    addSurveyRepositoryStub: AddSurveyRepository;
};

const makeFakeSurveyData = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer'
        }
    ],
    date: new Date()
});

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
        makeFakeDate.set(new Date());
    });

    afterAll(() => {
        makeFakeDate.reset();
    });

    it('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

        const surveyData = makeFakeSurveyData();
        await sut.add(surveyData);

        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });

    it('should throws if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(
            throwError
        );

        const promise = sut.add(makeFakeSurveyData());

        expect(promise).rejects.toThrow();
    });
});
