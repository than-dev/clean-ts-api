import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { LoginController } from './login';

describe('Login Controller', () => {
    interface SutTypes {
        sut: LoginController;
    }

    const makeSut = (): SutTypes => {
        const sut = new LoginController();

        return {
            sut
        };
    };

    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email'))
        );
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toBe(
            badRequest(new MissingParamError('password'))
        );
    });
});
