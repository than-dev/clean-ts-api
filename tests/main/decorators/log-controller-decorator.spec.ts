import { Controller, HttpResponse } from '@/presentation/protocols';
import { serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';

class ControllerSpy implements Controller {
    httpResponse = ok('any');
    request: any;

    async handle(request: any): Promise<HttpResponse> {
        this.request = request;
        return this.httpResponse;
    }
}

const mockServerError = (): HttpResponse => {
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    return serverError(fakeError);
};

type SutTypes = {
    sut: LogControllerDecorator;
    controllerSpy: ControllerSpy;
    logErrorRepositorySpy: LogErrorRepositorySpy;
};

const makeSut = (): SutTypes => {
    const controllerSpy = new ControllerSpy();
    const logErrorRepositorySpy = new LogErrorRepositorySpy();
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

        const request = 'any';
        await sut.handle(request);

        expect(controllerSpy.request).toEqual(request);
    });

    it('should return the same result of the controller', async () => {
        const { sut, controllerSpy } = makeSut();

        const httpResponse = await sut.handle('any');

        expect(httpResponse).toEqual(controllerSpy.httpResponse);
    });

    it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();

        const serverError = mockServerError();
        controllerSpy.httpResponse = serverError;

        await sut.handle('any');

        expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack);
    });
});
