import {
    Controller,
    HttpResponse,
    LoadSurveys,
    noContent,
    ok,
    serverError
} from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}

    async handle(
        request: LoadSurveysController.Request
    ): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurveys.load();

            return surveys.length ? ok(surveys) : noContent();
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace LoadSurveysController {
    export type Request = {};
}
