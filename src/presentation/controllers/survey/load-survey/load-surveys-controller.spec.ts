import { LoadSurveysController } from './load-surveys-controller';
import {
    HttpRequest,
    LoadSurveys,
    noContent,
    ok,
    serverError,
    SurveyModel
} from './load-surveys-controller-protocols';
import MockDate from 'mockdate';

type SutTypes = {
    sut: LoadSurveysController;
    loadSurveysStub: LoadSurveys;
};

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

    it('should return 200 on success', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(ok(makeFakeSurveys()));
    });

    it('should return 204 if LoadSurveys returns empty', async () => {
        const { sut, loadSurveysStub } = makeSut();

        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
            new Promise((resolve) => resolve([]))
        );

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(noContent());
    });

    it('should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysStub } = makeSut();

        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
