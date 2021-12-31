import { MongoHelper } from '../helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';
import makeFakeDate from 'mockdate';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        makeFakeDate.set(new Date());
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        makeFakeDate.reset();
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.deleteMany({});
    });

    describe('add()', () => {
        it('should return an account on add success', async () => {
            const sut = makeSut();
            await sut.add(mockSurveyModel());

            const survey = await surveyCollection.findOne({
                question: 'any_question'
            });
            expect(survey).toBeTruthy();
        });
    });

    describe('loadAll()', () => {
        it('should load all surveys on success', async () => {
            await surveyCollection.insertMany(mockSurveyModels());

            const sut = makeSut();
            const surveys = await sut.loadAll();

            expect(surveys.length).toBe(2);
            expect(surveys[0].question).toBe('any_question');
            expect(surveys[0].question).toBe('any_question');
            expect(surveys[0].id).toBeTruthy();
            expect(surveys[1].question).toBe('other_question');
        });

        it('should return an empty array', async () => {
            const sut = makeSut();
            const surveys = await sut.loadAll();
            expect(surveys.length).toBe(0);
        });
    });

    describe('loadById()', () => {
        it('should load survey by id on success', async () => {
            const response = await surveyCollection.insertOne(
                mockSurveyModel()
            );

            const id = response.insertedId.toHexString();

            const sut = makeSut();
            const survey = await sut.loadById(id);

            expect(survey).toBeTruthy();
            expect(survey.id).toBeTruthy();
        });

        it('should return null if a invalid id is provided', async () => {
            const sut = makeSut();
            const survey = await sut.loadById(
                ObjectId.generate() as unknown as string
            );

            expect(survey).toBeFalsy();
        });
    });
});
