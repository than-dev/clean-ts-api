import { Collection } from 'mongodb';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import request from 'supertest';
import app from '../config/app';
import { sign } from 'jsonwebtoken';
import env from '../config/env';
import MockDate from 'mockdate';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
    beforeAll(async () => {
        MockDate.set(new Date());
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(() => {
        MockDate.reset();
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
            const { insertedId } = await accountCollection.insertOne({
                name: 'Nathan',
                email: 'nathan.cotrim@gmail.com',
                password: 'n27a01t05',
                role: 'admin'
            });

            const { _id } = await accountCollection.findOne({
                _id: insertedId
            });

            const accessToken = sign({ _id }, env.jwtSecret);

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
});
