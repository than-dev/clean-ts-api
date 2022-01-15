import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyModel, mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import {
    SaveSurveyResult,
    SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { SurveyModel } from '../controllers/survey/load-survey/load-surveys-controller-protocols';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultSpy implements SaveSurveyResult {
        async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel());
        }
    }

    return new SaveSurveyResultSpy();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
    class LoadSurveyResultSpy implements LoadSurveyResult {
        async load(surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel());
        }
    }

    return new LoadSurveyResultSpy();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdSpy implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return Promise.resolve(mockSurveyModel());
        }
    }

    return new LoadSurveyByIdSpy();
};
