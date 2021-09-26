import { SurveyModel } from '../../../domain/models/survey';
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';
import { DbLoadSurveys } from './db-load-surveys';

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
        async load(): Promise<SurveyModel[]> {
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
    it('should call LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut();

        const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load');

        await sut.load();

        expect(loadSpy).toHaveBeenCalled();
    });
});
