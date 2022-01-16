import {
    Controller,
    forbidden,
    HttpResponse,
    InvalidParamError,
    LoadSurveyById,
    serverError,
    ok,
    LoadSurveyResult
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
    constructor(
        private readonly loadSurveyById: LoadSurveyById,
        private readonly loadSurveyResult: LoadSurveyResult
    ) {}

    async handle(
        request: LoadSurveyResultController.Request
    ): Promise<HttpResponse> {
        try {
            const { surveyId } = request;

            const survey = await this.loadSurveyById.loadById(surveyId);

            if (!survey) {
                return forbidden(new InvalidParamError('surveyId'));
            }

            const surveyResult = await this.loadSurveyResult.load(surveyId);

            return ok(surveyResult);
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace LoadSurveyResultController {
    export type Request = {
        surveyId: string;
    };
}
