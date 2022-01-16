import {
    AddSurvey,
    badRequest,
    Controller,
    HttpResponse,
    noContent,
    serverError,
    Validation
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
    constructor(
        private readonly validation: Validation,
        private readonly addSurvey: AddSurvey
    ) {}

    async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }
            await this.addSurvey.add({
                ...request,
                date: new Date()
            });

            return noContent();
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace AddSurveyController {
    export type Request = {
        question: string;
        answers: Answer[];
        date: Date;
    };

    type Answer = {
        image?: string;
        answer: string;
    };
}
