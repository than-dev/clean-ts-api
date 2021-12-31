import { SurveyResultModel } from '@/domain/models/survey-result';
import {
    SaveSurveyResult,
    SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import {
    forbidden,
    ok,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest } from '@/presentation/protocols/http';
import { SaveSurveyResultController } from './save-survey-result-controller';
import makeFakeDate from 'mockdate';
import { mockLoadSurveyByIdRepository } from '@/data/test';
import { mockSurveyResultModel } from '@/domain/test';

type SutTypes = {
    sut: SaveSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
    saveSurveyResultStub: SaveSurveyResult;
};

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: {
        answer: 'any_answer'
    },
    accountId: 'any_account_id'
});

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return new Promise((resolve) => resolve(mockSurveyResultModel()));
        }
    }

    return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyByIdRepository();
    const saveSurveyResultStub = makeSaveSurveyResultStub();
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
        makeFakeDate.set(new Date());
    });

    afterAll(async () => {
        makeFakeDate.reset();
    });

    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

        const fakeRequest = makeFakeRequest();

        await sut.handle(fakeRequest);

        expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId);
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);

        const httpResponse = await sut.handle(makeFakeRequest());

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

        const httpResponse = await sut.handle(makeFakeRequest());

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

        const fakeRequest = makeFakeRequest();

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

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 200 on success', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
    });
});
