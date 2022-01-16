import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { mockSurveyModel, throwError } from '@/tests/domain/mocks';
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks';
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id';

import mockDate from 'mockdate';

type SutTypes = {
    sut: DbLoadSurveyById;
    loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositorySpy = mockLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);

    return {
        sut,
        loadSurveyByIdRepositorySpy
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        mockDate.set(new Date());
    });

    afterAll(() => {
        mockDate.reset();
    });

    it('should call LoadSurveyByIdRepository', async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut();

        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');

        await sut.loadById('any_id');

        expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
    });

    it('should return Survey on success', async () => {
        const { sut } = makeSut();
        const survey = await sut.loadById('any_id');
        expect(survey).toEqual(mockSurveyModel());
    });

    it('should throw if LoadSurveyByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut();
        jest.spyOn(
            loadSurveyByIdRepositorySpy,
            'loadById'
        ).mockImplementationOnce(throwError);

        const promise = sut.loadById('any_id');
        await expect(promise).rejects.toThrow();
    });
});
