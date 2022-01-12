import { SurveyResultModel } from '../models/survey-result';
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result';

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            count: 1,
            percent: 50
        },
        {
            answer: 'any_answer',
            image: 'any_image',
            count: 1,
            percent: 50
        }
    ],
    date: new Date()
});
