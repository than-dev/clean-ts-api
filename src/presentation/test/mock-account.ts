import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/test';
import {
    AddAccount,
    AddAccountParams
} from '@/domain/usecases/account/add-account';

import {
    Authentication,
    AuthenticationParams
} from '@/domain/usecases/account/authentication';

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountParams): Promise<AccountModel> {
            return new Promise((resolve) => resolve(mockAccountModel()));
        }
    }
    return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationParams): Promise<string> {
            return new Promise((resolve) => resolve('any_token'));
        }
    }
    return new AuthenticationStub();
};
