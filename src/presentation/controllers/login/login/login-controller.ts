import {
    Controller,
    HttpResponse,
    Authentication,
    Validation,
    badRequest,
    ok,
    serverError,
    unauthorized
} from './login-controller-protocols';

export class LoginController implements Controller {
    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) {}

    async handle(request: LoginController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }

            const accessToken = await this.authentication.auth(request);
            if (!accessToken) {
                return unauthorized();
            }

            return ok({ accessToken });
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace LoginController {
    export type Request = {
        email: string;
        password: string;
    };
}
