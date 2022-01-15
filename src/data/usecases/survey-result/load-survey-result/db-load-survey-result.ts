import {
    LoadSurveyByIdRepository,
    LoadSurveyResult,
    LoadSurveyResultRepository,
    SurveyResultModel
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
    constructor(
        private readonly loadSurveyResultRespository: LoadSurveyResultRepository,
        private readonly loadSurveyByIdRespository: LoadSurveyByIdRepository
    ) {}

    async load(surveyId: string): Promise<SurveyResultModel> {
        const surveyResult =
            await this.loadSurveyResultRespository.loadBySurveyId(surveyId);

        if (!surveyResult) {
            await this.loadSurveyByIdRespository.loadById(surveyId);
        }

        return surveyResult;
    }
}
