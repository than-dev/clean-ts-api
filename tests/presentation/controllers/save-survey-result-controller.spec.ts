import {
    forbidden,
    ok,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { InvalidParamError } from '@/presentation/errors';
import { mockSaveSurveyResult } from '@/tests/presentation/mocks';
import { mockSurveyResultModel } from '@/tests/domain/mocks';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks';

import mockDate from 'mockdate';

type SutTypes = {
    sut: SaveSurveyResultController;
    loadSurveyByIdSpy: LoadSurveyById;
    saveSurveyResultSpy: SaveSurveyResult;
};

const mockRequest = (): SaveSurveyResultController.Request => ({
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    accountId: 'any_account_id'
});

const makeSut = (): SutTypes => {
    const loadSurveyByIdSpy = mockLoadSurveyByIdRepository();
    const saveSurveyResultSpy = mockSaveSurveyResult();
    const sut = new SaveSurveyResultController(
        loadSurveyByIdSpy,
        saveSurveyResultSpy
    );

    return {
        sut,
        loadSurveyByIdSpy,
        saveSurveyResultSpy
    };
};

describe('SaveSurveyResult Controller', () => {
    beforeAll(async () => {
        mockDate.set(new Date());
    });

    afterAll(async () => {
        mockDate.reset();
    });

    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, 'loadById');

        const request = mockRequest();

        await sut.handle(request);

        expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId);
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(null);

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });

    it('should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            })
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if an invalid answer is provided', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle({
            surveyId: 'any_survey_id',
            answer: 'wrong_answer',
            accountId: ''
        });

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('answer'))
        );
    });

    it('should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultSpy } = makeSut();
        const loadByIdSpy = jest.spyOn(saveSurveyResultSpy, 'save');

        const request = mockRequest();

        await sut.handle(request);

        expect(loadByIdSpy).toHaveBeenCalledWith({
            surveyId: request.surveyId,
            accountId: request.accountId,
            date: new Date(),
            answer: request.answer
        });
    });

    it('should return 500 if SaveSurveyResult throws', async () => {
        const { sut, saveSurveyResultSpy } = makeSut();
        jest.spyOn(saveSurveyResultSpy, 'save').mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            })
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 200 on success', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
    });
});
