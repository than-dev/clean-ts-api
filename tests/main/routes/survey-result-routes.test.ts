import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';

import app from '@/main/config/app';
import env from '@/main/config/env';

import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import mockDate from 'mockdate';
import request from 'supertest';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockAccessToken = async (): Promise<any> => {
    const { insertedId } = await accountCollection.insertOne({
        name: 'Nathan',
        email: 'nathan.cotrim@gmail.com',
        password: 'n27a01t05'
    });

    const accessToken = sign({ id: insertedId }, env.jwtSecret);

    await accountCollection.updateOne(
        {
            _id: new ObjectId(insertedId)
        },
        {
            $set: {
                accessToken
            }
        }
    );

    return accessToken;
};

describe('Survey Result Routes', () => {
    beforeAll(async () => {
        mockDate.set(new Date());
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(() => {
        mockDate.reset();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.deleteMany({});

        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    describe('PUT /surveys/:surveyId/results', () => {
        it('should return 403 on save survey result without access token', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403);
        });

        it('should return 200 on save survey result with accessToken', async () => {
            const surveyInsertResponse = await surveyCollection.insertOne({
                question: 'question',
                answers: [
                    {
                        answer: 'Answer 1',
                        image: 'http://fake-image.png'
                    },
                    {
                        answer: 'Answer 2'
                    }
                ],
                date: new Date()
            });

            const accessToken = await mockAccessToken();
            const surveyId = surveyInsertResponse.insertedId.toHexString();

            await request(app)
                .put(`/api/surveys/${surveyId}/results`)
                .set('x-access-token', accessToken)
                .send({
                    answer: 'Answer 1'
                })
                .expect(200);
        });
    });

    describe('GET /surveys/:surveyId/results', () => {
        it('should return 403 on save survey result without access token', async () => {
            await request(app)
                .get('/api/surveys/any_survey_id/results')
                .expect(403);
        });

        it('should return 200 on load survey result with accessToken', async () => {
            const surveyInsertResponse = await surveyCollection.insertOne({
                question: 'question',
                answers: [
                    {
                        answer: 'Answer 1',
                        image: 'http://fake-image.png'
                    }
                ],
                date: new Date()
            });

            const accessToken = await mockAccessToken();
            const surveyId = surveyInsertResponse.insertedId.toHexString();

            await request(app)
                .get(`/api/surveys/${surveyId}/results`)
                .set('x-access-token', accessToken)
                .expect(200);
        });
    });
});
