import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModels } from '@/tests/domain/mocks';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import {
    AddSurvey,
    AddSurveyParams
} from '@/domain/usecases/survey/add-survey';

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveySpy implements AddSurvey {
        async add(data: AddSurveyParams): Promise<void> {
            return Promise.resolve();
        }
    }

    return new AddSurveySpy();
};

export const mockLoadSurveys = (): LoadSurveys => {
    class LoadSurveysSpy implements LoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveyModels());
        }
    }

    return new LoadSurveysSpy();
};
