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
    class AddAccountSpy implements AddAccount {
        async add(account: AddAccountParams): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel());
        }
    }
    return new AddAccountSpy();
};

export const mockAuthentication = (): Authentication => {
    class AuthenticationSpy implements Authentication {
        async auth(authentication: AuthenticationParams): Promise<string> {
            return Promise.resolve('any_token');
        }
    }
    return new AuthenticationSpy();
};
