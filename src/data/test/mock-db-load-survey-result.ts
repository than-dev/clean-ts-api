/* eslint-disable @typescript-eslint/brace-style */

import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result';
import { SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

export const mockLoadSurveyResultRepositoryStub =
    (): LoadSurveyResultRepository => {
        class LoadSurveyResultRepositoryStub
            implements LoadSurveyResultRepository
        {
            async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
                return Promise.resolve(mockSurveyResultModel());
            }
        }

        return new LoadSurveyResultRepositoryStub();
    };
