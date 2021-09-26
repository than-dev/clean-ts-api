import {
    Controller,
    HttpRequest,
    HttpResponse,
    LoadSurveys
} from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const surveys = await this.loadSurveys.load();
        console.log(surveys);
        return null;
    }
}
