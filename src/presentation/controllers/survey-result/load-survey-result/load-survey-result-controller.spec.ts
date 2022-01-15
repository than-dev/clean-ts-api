import { mockSurveyResultModel, throwError } from '@/domain/test';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import {
    forbidden,
    ok,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest } from '@/presentation/protocols/http';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test';

import { LoadSurveyResultController } from './load-survey-result-controller';

type SutTypes = {
    sut: LoadSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
    loadSurveyResultStub: LoadSurveyResult;
};

const mockRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
});

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyById();
    const loadSurveyResultStub = mockLoadSurveyResult();
    const sut = new LoadSurveyResultController(
        loadSurveyByIdStub,
        loadSurveyResultStub
    );

    return {
        sut,
        loadSurveyByIdStub,
        loadSurveyResultStub
    };
};

describe('LoadSurveyResult Controller', () => {
    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

        const request = mockRequest();

        await sut.handle(request);

        expect(loadSurveyByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
    });

    it('should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(
            throwError
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });

    it('should call LoadSurveyResult with correct value', async () => {
        const { sut, loadSurveyResultStub } = makeSut();
        const loadSurveyResultSpy = jest.spyOn(loadSurveyResultStub, 'load');

        const httpRequest = mockRequest();
        await sut.handle(httpRequest);

        expect(loadSurveyResultSpy).toHaveBeenCalledWith(
            httpRequest.params.surveyId
        );
    });

    it('should return 500 if LoadSurveyResult throws', async () => {
        const { sut, loadSurveyResultStub } = makeSut();
        jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(
            throwError
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
