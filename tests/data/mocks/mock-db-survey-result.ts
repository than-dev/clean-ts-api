/* eslint-disable @typescript-eslint/brace-style */
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';

export const mockSaveSurveyResultRepository =
    (): SaveSurveyResultRepository => {
        class SaveSurveyResultRepositorySpy
            implements SaveSurveyResultRepository
        {
            async save(data: SaveSurveyResultParams): Promise<void> {
                return new Promise((resolve) => resolve());
            }
        }

        return new SaveSurveyResultRepositorySpy();
    };
