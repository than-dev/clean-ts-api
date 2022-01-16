import {
    HttpResponse,
    Controller,
    AddAccount,
    Authentication,
    Validation,
    badRequest,
    forbidden,
    ok,
    serverError,
    EmailInUseError
} from './signup-controller-protocols';

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle(request: SignUpController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }

            const { name, email, password } = request;

            const account = await this.addAccount.add({
                name,
                email,
                password
            });

            if (!account) {
                return forbidden(new EmailInUseError());
            }

            const accessToken = await this.authentication.auth({
                email,
                password
            });

            return ok({ accessToken });
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace SignUpController {
    export type Request = {
        name: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    };
}
