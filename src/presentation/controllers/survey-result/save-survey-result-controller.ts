import {
    Controller,
    HttpRequest,
    HttpResponse,
    forbidden,
    InvalidParamError,
    LoadSurveyById,
    serverError
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { surveyId } = httpRequest.params;

            const survey = await this.loadSurveyById.loadById(surveyId);
            if (!survey) return forbidden(new InvalidParamError('surveyId'));

            return null;
        } catch (error) {
            return serverError(error);
        }
    }
}
