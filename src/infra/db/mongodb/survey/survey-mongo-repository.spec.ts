import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';
import MockDate from 'mockdate';

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        MockDate.set(new Date());
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    beforeAll(() => {
        MockDate.reset();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.deleteMany({});
    });

    it('should return an account on add success', async () => {
        const sut = makeSut();
        await sut.add({
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

        const survey = await surveyCollection.findOne({
            question: 'any_question'
        });
        expect(survey).toBeTruthy();
    });
});
