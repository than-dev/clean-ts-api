/* eslint-disable @typescript-eslint/brace-style */

import { mockSurveyResultModel } from '@/tests/domain/mocks';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

export const mockLoadSurveyResultRepository =
    (): LoadSurveyResultRepository => {
        class LoadSurveyResultRepositorySpy
            implements LoadSurveyResultRepository
        {
            async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
                return Promise.resolve(mockSurveyResultModel());
            }
        }

        return new LoadSurveyResultRepositorySpy();
    };
