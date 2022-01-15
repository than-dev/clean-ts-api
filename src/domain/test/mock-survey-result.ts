import { SurveyResultModel } from '../models/survey-result';
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result';
import { AddSurveyParams } from '../usecases/survey/add-survey';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            image: 'any_image',
            count: 0,
            percent: 0
        },
        {
            answer: 'any_answer',
            image: 'any_image',
            count: 0,
            percent: 0
        }
    ],
    date: new Date()
});

export const mockAddSurveyParams = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer'
        },
        {
            answer: 'other_answer'
        },
        {
            answer: 'last_answer'
        }
    ],
    date: new Date()
});
