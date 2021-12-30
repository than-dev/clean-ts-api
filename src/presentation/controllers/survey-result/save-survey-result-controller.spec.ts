import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import {
    forbidden,
    HttpRequest,
    SurveyModel
} from '../survey/load-survey/load-surveys-controller-protocols';
import { SaveSurveyResultController } from './save-survey-result-controller';

type SutTypes = {
    sut: SaveSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
};

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
});

const makeSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer'
        },
        {
            answer: 'any_answer'
        }
    ],
    date: new Date()
});

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return new Promise((resolve) => resolve(makeSurvey()));
        }
    }

    return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyByIdStub();
    const sut = new SaveSurveyResultController(loadSurveyByIdStub);

    return {
        sut,
        loadSurveyByIdStub
    };
};

describe('SaveSurveyResult Controller', () => {
    it('should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

        const fakeRequest = makeFakeRequest();

        await sut.handle(fakeRequest);

        expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId);
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut();
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(
            forbidden(new InvalidParamError('surveyId'))
        );
    });
});
