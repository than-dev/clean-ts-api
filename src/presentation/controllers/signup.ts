export class SignUpController {
    handle(httpResponse: any): any {
        return {
            statusCode: 400,
            body: new Error('Missing param: name')
        };
    }
}
