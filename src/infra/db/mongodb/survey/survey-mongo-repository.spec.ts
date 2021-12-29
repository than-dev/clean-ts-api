import { MongoHelper } from '../helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
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

    afterAll(async () => {
        MockDate.reset();
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.deleteMany({});
    });

    describe('add()', () => {
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

    describe('loadAll()', () => {
        it('should load all surveys on success', async () => {
            await surveyCollection.insertMany([
                {
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
                },
                {
                    question: 'other_question',
                    answers: [
                        {
                            image: 'other_image',
                            answer: 'other_answer'
                        },
                        {
                            answer: 'other_answer'
                        }
                    ],
                    date: new Date()
                }
            ]);

            const sut = makeSut();
            const surveys = await sut.loadAll();

            expect(surveys.length).toBe(2);
            expect(surveys[0].question).toBe('any_question');
            expect(surveys[1].question).toBe('other_question');
        });

        it('should return an empty array', async () => {
            const sut = makeSut();
            const surveys = await sut.loadAll;
            expect(surveys.length).toBe(0);
        });
    });

    describe('loadById()', () => {
        it('should load survey by id on success', async () => {
            const response = await surveyCollection.insertOne({
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

            const id = response.insertedId.toHexString();

            const sut = makeSut();
            const survey = await sut.loadById(id);

            expect(survey).toBeTruthy();
        });

        it('should return null if is a invalid id', async () => {
            const sut = makeSut();
            const survey = await sut.loadById(
                ObjectId.generate() as unknown as string
            );

            expect(survey).toBeFalsy();
        });
    });
});
