import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import request from 'supertest';
import app from '../config/app';
import { sign } from 'jsonwebtoken';
import env from '../config/env';
import mockDate from 'mockdate';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockAccessToken = async (role?: string): Promise<any> => {
    const { insertedId } = await accountCollection.insertOne({
        name: 'Nathan',
        email: 'nathan.cotrim@gmail.com',
        password: 'n27a01t05',
        role
    });

    const { _id } = await accountCollection.findOne({
        _id: insertedId
    });

    const accessToken = sign({ _id }, env.jwtSecret);

    return {
        accessToken,
        _id
    };
};

describe('Survey Routes', () => {
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
    describe('POST /surveys', () => {
        it('should return 403 on add survey without access token', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ],
                    date: new Date()
                })
                .expect(403);
        });

        it('should return 204 on add survey with valid access token', async () => {
            const { accessToken, _id } = await mockAccessToken('admin');

            await accountCollection.updateOne(
                {
                    _id
                },
                {
                    $set: {
                        accessToken
                    }
                }
            );

            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send({
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ],
                    date: new Date()
                })
                .expect(204);
        });
    });

    describe('GET /surveys', () => {
        it('should return 403 on load surveys without access token', async () => {
            await request(app).get('/api/surveys').expect(403);
        });

        it('should return 200 on load surveys with valid access token', async () => {
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

            const { accessToken, _id } = await mockAccessToken();

            await accountCollection.updateOne(
                {
                    _id
                },
                {
                    $set: {
                        accessToken
                    }
                }
            );

            await request(app)
                .get('/api/surveys')
                .set('x-access-token', accessToken)
                .send({
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ],
                    date: new Date()
                })
                .expect(200);
        });
    });
});
