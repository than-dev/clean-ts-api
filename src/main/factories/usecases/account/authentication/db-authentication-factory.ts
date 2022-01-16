import env from '../../../../config/env';
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter';
import { Authentication } from '@/domain/usecases/account/authentication';

export const makeDbAuthentication = (): Authentication => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    );
};
