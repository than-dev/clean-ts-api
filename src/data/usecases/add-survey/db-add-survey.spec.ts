/* eslint-disable @typescript-eslint/no-floating-promises */
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';

describe('DbAddSurvey Usecase', () => {
    interface SutTypes {
        sut: DbAddSurvey;
        addSurveyRepositoryStub: AddSurveyRepository;
    }

    const makeFakeSurveyData = (): AddSurveyModel => ({
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            }
        ]
    });

    const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
        class AddSurveyRepositoryStub implements AddSurveyRepository {
            async add(surveyData: AddSurveyModel): Promise<void> {
                return new Promise((resolve) => resolve());
            }
        }

        return new AddSurveyRepositoryStub();
    };

    const makeSut = (): SutTypes => {
        const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
        const sut = new DbAddSurvey(addSurveyRepositoryStub);

        return {
            sut,
            addSurveyRepositoryStub
        };
    };

    it('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

        const surveyData = makeFakeSurveyData();
        await sut.add(surveyData);

        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });

    it('should throws if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );

        const promise = sut.add(makeFakeSurveyData());

        expect(promise).rejects.toThrow();
    });
});
