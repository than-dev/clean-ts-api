import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';
import { mockAddAccountParams } from '@/domain/test';
import { Collection, ObjectId } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
    const response = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            },
            {
                answer: 'other_answer'
            },
            {
                answer: 'last_answer'
            }
        ],
        date: new Date()
    });

    const survey = await surveyCollection.findOne({
        _id: response.insertedId
    });

    return MongoHelper.map(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
    const response = await accountCollection.insertOne(mockAddAccountParams());

    const account = await accountCollection.findOne({
        _id: response.insertedId
    });

    return MongoHelper.map(account);
};

describe('Survey Result Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.deleteMany({});
        surveyResultCollection = await MongoHelper.getCollection(
            'surveyResults'
        );
        await surveyResultCollection.deleteMany({});
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    describe('save()', () => {
        it('should add a survey result if its new', async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();

            const sut = makeSut();
            await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date()
            });

            const response = await surveyResultCollection.findOne({
                surveyId: survey.id,
                accountId: account.id
            });

            expect(response).toBeTruthy();
        });

        it('should update survey result if its not new', async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();
            await surveyResultCollection.insertOne({
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            });

            const sut = makeSut();
            await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[1].answer,
                date: new Date()
            });

            const surveyResult = await surveyResultCollection
                .find({
                    surveyId: survey.id,
                    accountId: account.id
                })
                .toArray();

            expect(surveyResult).toBeTruthy();
            expect(surveyResult.length).toBe(1);
        });
    });

    describe('loadBySurveyId()', () => {
        // it('should load survey result', async () => {
        //     const survey = await makeSurvey();
        //     const account = await makeAccount();
        //     await surveyResultCollection.insertMany([
        //         {
        //             surveyId: new ObjectId(survey.id),
        //             accountId: new ObjectId(account.id),
        //             answer: survey.answers[0].answer,
        //             date: new Date()
        //         },
        //         {
        //             surveyId: new ObjectId(survey.id),
        //             accountId: new ObjectId(account.id),
        //             answer: survey.answers[0].answer,
        //             date: new Date()
        //         },
        //         {
        //             surveyId: new ObjectId(survey.id),
        //             accountId: new ObjectId(account.id),
        //             answer: survey.answers[1].answer,
        //             date: new Date()
        //         },
        //         {
        //             surveyId: new ObjectId(survey.id),
        //             accountId: new ObjectId(account.id),
        //             answer: survey.answers[1].answer,
        //             date: new Date()
        //         }
        //     ]);
        //     const sut = makeSut();
        //     const surveyResult = await sut.loadBySurveyId(survey.id);
        //     expect(surveyResult).toBeTruthy();
        //     expect(surveyResult.surveyId).toEqual(survey.id);
        //     expect(surveyResult.answers[0].count).toBe(2);
        //     expect(surveyResult.answers[0].percent).toBe(50);
        //     expect(surveyResult.answers[1].count).toBe(2);
        //     expect(surveyResult.answers[1].percent).toBe(50);
        //     expect(surveyResult.answers[2].count).toBe(0);
        //     expect(surveyResult.answers[2].percent).toBe(0);
        // });
    });
});
