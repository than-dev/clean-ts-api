/* eslint-disable @typescript-eslint/no-floating-promises */
import mockDate from 'mockdate';
import { mockSurveyModels, throwError } from '@/tests/domain/mocks';
import { mockLoadSurveysRepository } from '@/tests/data/mocks';
import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols';
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';

type SutTypes = {
    sut: DbLoadSurveys;
    loadSurveysRepositorySpy: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveysRepositorySpy = mockLoadSurveysRepository();
    const sut = new DbLoadSurveys(loadSurveysRepositorySpy);

    return {
        sut,
        loadSurveysRepositorySpy
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositorySpy } = makeSut();

        const loadSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll');

        await sut.load();

        expect(loadSpy).toHaveBeenCalled();
    });

    it('should return a array of surveys on success', async () => {
        const { sut } = makeSut();

        const surveys = await sut.load();

        expect(surveys).toEqual(mockSurveyModels());
    });

    it('should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositorySpy } = makeSut();

        jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(
            throwError
        );

        const promise = sut.load();

        expect(promise).rejects.toThrow();
    });
});
