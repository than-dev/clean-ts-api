import { AccountModel } from '../models/account';
import { AddAccountParams } from '../usecases/account/add-account';

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
