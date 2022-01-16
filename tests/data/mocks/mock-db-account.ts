/* eslint-disable @typescript-eslint/brace-style */
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/tests/domain/mocks';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositorySpy implements AddAccountRepository {
        async add(accountData: AddAccountParams): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel());
        }
    }
    return new AddAccountRepositorySpy();
};

export const mockLoadAccountByEmailRepository =
    (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRepositorySpy
            implements LoadAccountByEmailRepository
        {
            async loadByEmail(email: string): Promise<AccountModel> {
                return Promise.resolve(mockAccountModel());
            }
        }
        return new LoadAccountByEmailRepositorySpy();
    };

export const mockLoadAccountByTokenRepository =
    (): LoadAccountByTokenRepository => {
        class LoadAccountByTokenRepositorySpy
            implements LoadAccountByTokenRepository
        {
            async loadByToken(
                token: string,
                role?: string
            ): Promise<AccountModel> {
                return Promise.resolve(mockAccountModel());
            }
        }

        return new LoadAccountByTokenRepositorySpy();
    };

export const mockUpdateAccessTokenRepository =
    (): UpdateAccessTokenRepository => {
        class UpdateAccessTokenRepositorySpy
            implements UpdateAccessTokenRepository
        {
            async updateAccessToken(id: string, token: string): Promise<void> {
                return Promise.resolve();
            }
        }
        return new UpdateAccessTokenRepositorySpy();
    };
