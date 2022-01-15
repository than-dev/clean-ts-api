import {
    Controller,
    forbidden,
    HttpRequest,
    HttpResponse,
    InvalidParamError,
    LoadSurveyById,
    serverError
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { surveyId } = httpRequest.body;

            const survey = await this.loadSurveyById.loadById(surveyId);

            if (!survey) {
                return forbidden(new InvalidParamError('surveyId'));
            }

            return null;
        } catch (error) {
            return serverError(error);
        }
    }
}
