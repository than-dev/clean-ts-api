import { SurveyModel } from '../../models/survey';

export type AddSurveyParams = Omit<SurveyModel, 'id'>;

export type SurveyAnswer = {
    image?: string;
    answer: string;
};

export interface AddSurvey {
    add(data: AddSurveyParams): Promise<void>;
}
