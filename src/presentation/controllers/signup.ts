import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';

export class SignUpController {
    handle(httpResponse: HttpRequest): HttpResponse {
        if (!httpResponse.body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('email')
            };
        }

        if (!httpResponse.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name')
            };
        }

        return {
            statusCode: 200,
            body: 'success'
        };
    }
}
