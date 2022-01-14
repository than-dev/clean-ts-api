import {
    LoadSurveyResult,
    LoadSurveyResultRepository,
    SurveyResultModel
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
    constructor(
        private readonly loadSurveyResultRespository: LoadSurveyResultRepository
    ) {}

    async load(surveyId: string): Promise<SurveyResultModel> {
        await this.loadSurveyResultRespository.loadBySurveyId(surveyId);
        return null;
    }
}
