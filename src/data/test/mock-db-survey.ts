import { SurveyModel } from '@/domain/models/survey';
import { mockSurvey, mockSurveys } from '@/domain/test';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(surveyData: AddSurveyParams): Promise<void> {
            return new Promise((resolve) => resolve());
        }
    }

    return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return new Promise((resolve) => resolve(mockSurvey()));
        }
    }

    return new LoadSurveyByIdStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return new Promise((resolve) => resolve(mockSurveys()));
        }
    }

    return new LoadSurveysRepositoryStub();
};
