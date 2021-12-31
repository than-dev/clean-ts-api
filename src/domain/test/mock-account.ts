import { AccountModel } from '../models/account';
import { AddAccountParams } from '../usecases/account/add-account';
import { AuthenticationParams } from '../usecases/account/authentication';

export const mockAccountModel = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
});

export const mockAccountDataParams = (): AddAccountParams => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
});

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'any_email@mail.com',
    password: 'any_password'
});
