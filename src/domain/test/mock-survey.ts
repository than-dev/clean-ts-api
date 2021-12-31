import { SurveyModel } from '../models/survey';

export const mockSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            image: 'any_image'
        }
    ],
    date: new Date()
});

export const mockSurveys = (): SurveyModel[] => {
    return [
        {
            id: 'any_id',
            question: 'any_question',
            answers: [
                {
                    answer: 'any_answer',
                    image: 'any_image'
                }
            ],
            date: new Date()
        },
        {
            id: 'other_id',
            question: 'other_question',
            answers: [
                {
                    answer: 'other_answer',
                    image: 'other_image'
                }
            ],
            date: new Date()
        }
    ];
};
