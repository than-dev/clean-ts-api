import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import MockDate from 'mockdate';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';

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
                answer: 'any_answer'
            }
        ],
        date: new Date()
    });

    const survey = await surveyCollection.findOne({
        _id: response.insertedId
    });

    return Object.assign({}, survey) as SurveyModel;
};

const makeAccount = async (): Promise<AccountModel> => {
    const response = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
    });

    const account = await accountCollection.findOne({
        _id: response.insertedId
    });

    return Object.assign({}, account, { id: account._id }) as AccountModel;
};

describe('Survey Result Mongo Repository', () => {
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

        surveyResultCollection = await MongoHelper.getCollection(
            'surveyResults'
        );
        await surveyResultCollection.deleteMany({});

        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    describe('save()', () => {
        it("should add a survey result if it's new", async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();

            const sut = makeSut();
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date()
            });

            expect(surveyResult).toBeTruthy();
            expect(surveyResult.id).toBeTruthy();
            expect(surveyResult.answer).toBe(survey.answers[0].answer);
        });
    });
});
