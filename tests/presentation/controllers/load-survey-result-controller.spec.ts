import {
    forbidden,
    ok,
    serverError
} from '@/presentation/helpers/http/http-helper';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { InvalidParamError } from '@/presentation/errors';
import { mockSurveyResultModel, throwError } from '@/tests/domain/mocks';
import {
    mockLoadSurveyById,
    mockLoadSurveyResult
} from '@/tests/presentation/mocks';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';

import mockDate from 'mockdate';

type SutTypes = {
    sut: LoadSurveyResultController;
    loadSurveyByIdSpy: LoadSurveyById;
    loadSurveyResultSpy: LoadSurveyResult;
};

const mockRequest = (): LoadSurveyResultController.Request => ({
    surveyId: 'any_survey_id'
});

const makeSut = (): SutTypes => {
    const loadSurveyByIdSpy = mockLoadSurveyById();
    const loadSurveyResultSpy = mockLoadSurveyResult();
    const sut = new LoadSurveyResultController(
        loadSurveyByIdSpy,
        loadSurveyResultSpy
    );

    return {
        sut,
        loadSurveyByIdSpy,
        loadSurveyResultSpy
    };
};

describe('LoadSurveyResult Controller', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        const loadSurveyByIdSpied = jest.spyOn(loadSurveyByIdSpy, 'loadById');

        const request = mockRequest();

        await sut.handle(request);

        expect(loadSurveyByIdSpied).toHaveBeenCalledWith(request.surveyId);
    });

    it('should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(
            throwError
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdSpy } = makeSut();
        jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(
            Promise.resolve(null)
        );

        const httpResponse = await sut.handle(mockRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });

    it('should call LoadSurveyResult with correct value', async () => {
        const { sut, loadSurveyResultSpy } = makeSut();
        const loadSurveyByIdSpied = jest.spyOn(loadSurveyResultSpy, 'load');

        const request = mockRequest();
        await sut.handle(request);

        expect(loadSurveyByIdSpied).toHaveBeenCalledWith(request.surveyId);
    });

    it('should return 500 if LoadSurveyResult throws', async () => {
        const { sut, loadSurveyResultSpy } = makeSut();
        jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(
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
