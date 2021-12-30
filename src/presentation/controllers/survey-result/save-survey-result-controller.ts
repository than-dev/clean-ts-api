import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import {
    Controller,
    HttpRequest,
    HttpResponse
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { surveyId } = httpRequest.params;

        await this.loadSurveyById.loadById(surveyId);

        return null;
    }
}
