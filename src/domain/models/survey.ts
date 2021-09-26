export interface SurveyModel {
    question: string;
    answers: SurveyAnswerModel[];
    date: Date;
}

export interface SurveyAnswerModel {
    image?: string;
    answer: string;
}
