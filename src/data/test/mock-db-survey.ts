import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositorySpy implements AddSurveyRepository {
        async add(surveyData: AddSurveyParams): Promise<void> {
            return Promise.resolve();
        }
    }

    return new AddSurveyRepositorySpy();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyById => {
    class LoadSurveyByIdSpy implements LoadSurveyByIdRepository {
        async loadById(id: string): Promise<SurveyModel> {
            return Promise.resolve(mockSurveyModel());
        }
    }

    return new LoadSurveyByIdSpy();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositorySpy implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveyModels());
        }
    }

    return new LoadSurveysRepositorySpy();
};
