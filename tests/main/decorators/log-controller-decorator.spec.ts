import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import {
    Controller,
    HttpRequest,
    HttpResponse
} from '@/presentation/protocols';
import { serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockAccountModel } from '@/tests/domain/mocks';
import { mockLogErrorRepository } from '@/tests/data/mocks';

const makeController = (): Controller => {
    class ControllerSpy implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return Promise.resolve(ok(mockAccountModel()));
        }
    }
    return new ControllerSpy();
};

const mockRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    return serverError(fakeError);
};

type SutTypes = {
    sut: LogControllerDecorator;
    controllerSpy: Controller;
    logErrorRepositorySpy: LogErrorRepository;
};

const makeSut = (): SutTypes => {
    const controllerSpy = makeController();
    const logErrorRepositorySpy = mockLogErrorRepository();
    const sut = new LogControllerDecorator(
        controllerSpy,
        logErrorRepositorySpy
    );
    return {
        sut,
        controllerSpy,
        logErrorRepositorySpy
    };
};

describe('LogController Decorator', () => {
    it('should call controller handle', async () => {
        const { sut, controllerSpy } = makeSut();
        const handleSpy = jest.spyOn(controllerSpy, 'handle');
        await sut.handle(mockRequest());
        expect(handleSpy).toHaveBeenCalledWith(mockRequest());
    });

    it('should return the same result of the controller', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(ok(mockAccountModel()));
    });

    it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
        const logSpy = jest.spyOn(logErrorRepositorySpy, 'logError');
        jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(
            Promise.resolve(makeFakeServerError())
        );
        await sut.handle(mockRequest());
        expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
