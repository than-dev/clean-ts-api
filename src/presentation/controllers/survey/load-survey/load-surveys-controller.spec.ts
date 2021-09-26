import { LoadSurveysController } from './load-surveys-controller';
import {
    HttpRequest,
    LoadSurveys,
    SurveyModel
} from './load-surveys-controller-protocols';
import MockDate from 'mockdate';

interface SutTypes {
    sut: LoadSurveysController;
    loadSurveysStub: LoadSurveys;
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

const makeFakeRequest = (): HttpRequest => ({});

const makeLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return new Promise((resolve) => resolve(makeFakeSurveys()));
        }
    }

    return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveysStub();
    const sut = new LoadSurveysController(loadSurveysStub);

    return {
        sut,
        loadSurveysStub
    };
};

describe('LoadSurveys Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date());
    });

    afterAll(() => {
        MockDate.reset();
    });

    it('should call LoadSurveys with correct values', async () => {
        const { sut, loadSurveysStub } = makeSut();

        const loadSpy = jest.spyOn(loadSurveysStub, 'load');

        await sut.handle(makeFakeRequest());

        expect(loadSpy).toHaveBeenCalled();
    });
});
