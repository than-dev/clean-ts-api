import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyCollection = await MongoHelper.getCollection(
            'surveyResults'
        );

        const response = await surveyCollection.findOneAndUpdate(
            {
                surveyId: data.surveyId,
                accountId: data.accountId
            },
            {
                $set: {
                    answer: data.answer,
                    date: data.date
                }
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return Object.assign({}, response.value, {
            id: response.value._id
        }) as SurveyResultModel;
    }
}
