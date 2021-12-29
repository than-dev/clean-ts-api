import { SurveyModel } from '@/domain/models/survey';
import MockDate from 'mockdate';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
    sut: DbLoadSurveyById;
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeFakeSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            image: 'any_image'
        }
    ],
    date: new Date()
});

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById(id: string): Promise<SurveyModel> {
            return new Promise((resolve) => resolve(makeFakeSurvey()));
        }
    }

    return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

    return {
        sut,
        loadSurveyByIdRepositoryStub
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        MockDate.set(new Date());
    });

    afterAll(() => {
        MockDate.reset();
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
        expect(survey).toEqual(makeFakeSurvey());
    });

    it('should throw if LoadSurveyByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut();
        jest.spyOn(
            loadSurveyByIdRepositoryStub,
            'loadById'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.loadById('any_id');
        await expect(promise).rejects.toThrow();
    });
});
