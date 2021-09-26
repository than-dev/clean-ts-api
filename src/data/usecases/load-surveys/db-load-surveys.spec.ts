/* eslint-disable @typescript-eslint/no-floating-promises */
import { SurveyModel } from '../../../domain/models/survey';
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';
import { DbLoadSurveys } from './db-load-surveys';
import MockDate from 'mockdate';

interface SutTypes {
    sut: DbLoadSurveys;
    loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeFakeSurveys = (): SurveyModel[] => {
    return [
        {
            id: 'any_id',
            question: 'any_question',
            answers: [
                {
                    answer: 'any_answer',
                    image: 'any_image'
                }
            ],
            date: new Date()
        },
        {
            id: 'other_id',
            question: 'other_question',
            answers: [
                {
                    answer: 'other_answer',
                    image: 'other_image'
                }
            ],
            date: new Date()
        }
    ];
};

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return new Promise((resolve) => resolve(makeFakeSurveys()));
        }
    }

    return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub();
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

    return {
        sut,
        loadSurveysRepositoryStub
    };
};

describe('DbLoadSurveys', () => {
    beforeAll(() => {
        MockDate.set(new Date());
    });

    afterAll(() => {
        MockDate.reset();
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

        expect(surveys).toEqual(makeFakeSurveys());
    });

    it('should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut();

        jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.load();

        expect(promise).rejects.toThrow();
    });
});
