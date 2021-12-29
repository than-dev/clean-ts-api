import { SurveyModel } from '../../models/survey';

export type AddSurveyModel = Omit<SurveyModel, 'id'>;

export type SurveyAnswer = {
    image?: string;
    answer: string;
};

export interface AddSurvey {
    add(data: AddSurveyModel): Promise<void>;
}
