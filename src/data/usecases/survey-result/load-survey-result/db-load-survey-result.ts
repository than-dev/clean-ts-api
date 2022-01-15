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
        let surveyResult =
            await this.loadSurveyResultRespository.loadBySurveyId(surveyId);

        if (!surveyResult) {
            const survey = await this.loadSurveyByIdRespository.loadById(
                surveyId
            );

            surveyResult = {
                surveyId: survey.id,
                question: survey.question,
                date: survey.date,
                answers: survey.answers.map((answer) =>
                    Object.assign({}, answer, {
                        count: 0,
                        percent: 0
                    })
                )
            };
        }

        return surveyResult;
    }
}
