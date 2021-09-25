import { Collection } from 'mongodb';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import request from 'supertest';
import app from '../config/app';

let surveyCollection: Collection;

describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('accounts');
        await surveyCollection.deleteMany({});
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    describe('POST /surveys', () => {
        it('should return 403 on addSurvey without accessToken', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ]
                })
                .expect(403);
        });
    });
});
