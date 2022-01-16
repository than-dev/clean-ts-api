import { SurveyModel } from '@/domain/models/survey';

export const mockSurveyModel = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            image: 'any_image'
        },
        {
            answer: 'any_answer',
            image: 'any_image'
        }
    ],
    date: new Date()
});

export const mockSurveyModels = (): SurveyModel[] => {
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
