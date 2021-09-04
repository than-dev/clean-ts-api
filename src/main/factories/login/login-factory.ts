import env from '../../config/env';
import { BcryptAdapter } from './../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from './../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from './../../../infra/db/mongodb/log/log-mongo-repository';
import { LogControllerDecorator } from './../../decorators/log-controller-decorator';
import { Controller } from '../../../presentation/protocols';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { makeLoginValidation } from './login-validation-factory';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
    const salt = 12;
    const accountMongoRepository = new AccountMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const dbAuthentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    );
    const validation = makeLoginValidation();
    const loginController = new LoginController(validation, dbAuthentication);
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(loginController, logMongoRepository);
};
