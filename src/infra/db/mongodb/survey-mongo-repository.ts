/* eslint-disable @typescript-eslint/brace-style */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { ObjectId } from 'mongodb';
import { MongoHelper } from './mongo-helper';

export class SurveyMongoRepository
    implements
        AddSurveyRepository,
        LoadSurveysRepository,
        LoadSurveyByIdRepository
{
    async loadById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection('surveys');
        const survey = await surveyCollection.findOne<SurveyModel>({
            _id: new ObjectId(id)
        });

        return survey && MongoHelper.map(survey);
    }

    async add(surveyData: AddSurveyParams): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.insertOne(surveyData);
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys');

        const surveys = await surveyCollection.find({}).toArray();

        return MongoHelper.mapCollection(surveys);
    }
}
