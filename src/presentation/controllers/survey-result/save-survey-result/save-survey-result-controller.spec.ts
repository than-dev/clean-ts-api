import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import {
    forbidden,
    ok,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest } from '@/presentation/protocols/http';
import { SaveSurveyResultController } from './save-survey-result-controller';
import mockDate from 'mockdate';
import { mockLoadSurveyByIdRepository } from '@/data/test';
import { mockSurveyResultModel } from '@/domain/test';
import { mockSaveSurveyResult } from '@/presentation/test';

type SutTypes = {
    sut: SaveSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
    saveSurveyResultStub: SaveSurveyResult;
};

const mockRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: {
        answer: 'any_answer'
    },
    accountId: 'any_account_id'
});

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyByIdRepository();
    const saveSurveyResultStub = mockSaveSurveyResult();
    const sut = new SaveSurveyResultController(
        loadSurveyByIdStub,
        saveSurveyResultStub
    );

    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub
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
        const { sut, loadSurveyByIdStub } = makeSut();
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

        const fakeRequest = mockRequest();

        await sut.handle(fakeRequest);

        expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId);
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });

    it('should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
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
            params: {
                surveyId: 'any_survey_id'
            },
            body: {
                answer: 'wrong_answer'
            }
        });

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('answer'))
        );
    });

    it('should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut();
        const loadByIdSpy = jest.spyOn(saveSurveyResultStub, 'save');

        const fakeRequest = mockRequest();

        await sut.handle(fakeRequest);

        expect(loadByIdSpy).toHaveBeenCalledWith({
            surveyId: fakeRequest.params.surveyId,
            accountId: fakeRequest.accountId,
            date: new Date(),
            answer: fakeRequest.body.answer
        });
    });

    it('should return 500 if SaveSurveyResult throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut();
        jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(
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