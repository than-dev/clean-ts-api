import makeFakeDate from 'mockdate';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { DbLoadSurveyById } from './db-load-survey-by-id';

import { mockSurveyModel, throwError } from '@/domain/test';
import { mockLoadSurveyByIdRepository } from '@/data/test';

type SutTypes = {
    sut: DbLoadSurveyById;
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

    return {
        sut,
        loadSurveyByIdRepositoryStub
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        makeFakeDate.set(new Date());
    });

    afterAll(() => {
        makeFakeDate.reset();
    });

    it('should call LoadSurveyByIdRepository', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut();

        const loadByIdSpy = jest.spyOn(
            loadSurveyByIdRepositoryStub,
            'loadById'
        );

        await sut.loadById('any_id');

        expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
    });

    it('should return Survey on success', async () => {
        const { sut } = makeSut();
        const survey = await sut.loadById('any_id');
        expect(survey).toEqual(mockSurveyModel());
    });

    it('should throw if LoadSurveyByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut();
        jest.spyOn(
            loadSurveyByIdRepositoryStub,
            'loadById'
        ).mockImplementationOnce(throwError);

        const promise = sut.loadById('any_id');
        await expect(promise).rejects.toThrow();
    });
});
