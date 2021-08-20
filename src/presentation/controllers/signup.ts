import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';

export class SignUpController {
    handle(httpResponse: HttpRequest): HttpResponse {
        if (!httpResponse.body.email) {
            return badRequest(new MissingParamError('email'));
        }

        if (!httpResponse.body.name) {
            return badRequest(new MissingParamError('name'));
        }

        return {
            statusCode: 200,
            body: 'success'
        };
    }
}
