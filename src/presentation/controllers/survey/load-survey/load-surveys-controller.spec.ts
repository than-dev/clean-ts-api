import { LoadSurveysController } from './load-surveys-controller';
import {
    LoadSurveys,
    noContent,
    ok,
    serverError
} from './load-surveys-controller-protocols';
import { mockSurveyModels, throwError } from '@/domain/test';

import mockDate from 'mockdate';
import { mockLoadSurveys } from '@/presentation/test';

type SutTypes = {
    sut: LoadSurveysController;
    loadSurveysSpy: LoadSurveys;
};

const makeSut = (): SutTypes => {
    const loadSurveysSpy = mockLoadSurveys();
    const sut = new LoadSurveysController(loadSurveysSpy);

    return {
        sut,
        loadSurveysSpy
    };
};

describe('LoadSurveys Controller', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call LoadSurveys with correct values', async () => {
        const { sut, loadSurveysSpy } = makeSut();

        const loadSpy = jest.spyOn(loadSurveysSpy, 'load');

        await sut.handle({});

        expect(loadSpy).toHaveBeenCalled();
    });

    it('should return 200 on success', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(ok(mockSurveyModels()));
    });

    it('should return 204 if LoadSurveys returns empty', async () => {
        const { sut, loadSurveysSpy } = makeSut();

        jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(
            Promise.resolve([])
        );

        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(noContent());
    });

    it('should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysSpy } = makeSut();

        jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);

        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
