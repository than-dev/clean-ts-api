import {
    Controller,
    HttpRequest,
    HttpResponse,
    forbidden,
    InvalidParamError,
    LoadSurveyById
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { surveyId } = httpRequest.params;

        const survey = await this.loadSurveyById.loadById(surveyId);
        if (!survey) return forbidden(new InvalidParamError('surveyId'));

        return null;
    }
}
