/* eslint-disable @typescript-eslint/no-floating-promises */
import makeFakeDate from 'mockdate';
import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepository } from './db-load-surveys-protocols';
import { mockSurveys, throwError } from '@/domain/test/';
import { mockLoadSurveysRepository } from '@/data/test';

type SutTypes = {
    sut: DbLoadSurveys;
    loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = mockLoadSurveysRepository();
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

    return {
        sut,
        loadSurveysRepositoryStub
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        makeFakeDate.set(new Date());
    });

    afterAll(() => {
        makeFakeDate.reset();
    });

    it('should call LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut();

        const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

        await sut.load();

        expect(loadSpy).toHaveBeenCalled();
    });

    it('should return a array of surveys on success', async () => {
        const { sut } = makeSut();

        const surveys = await sut.load();

        expect(surveys).toEqual(mockSurveys());
    });

    it('should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut();

        jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(
            throwError
        );

        const promise = sut.load();

        expect(promise).rejects.toThrow();
    });
});
