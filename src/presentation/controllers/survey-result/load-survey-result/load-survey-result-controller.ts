import {
    Controller,
    HttpRequest,
    HttpResponse,
    LoadSurveyById,
    serverError
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { surveyId } = httpRequest.body;

            await this.loadSurveyById.loadById(surveyId);

            return null;
        } catch (error) {
            return serverError(error);
        }
    }
}
