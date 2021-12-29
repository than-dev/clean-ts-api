import {
    AccountModel,
    Decrypter,
    LoadAccountByToken,
    LoadAccountByTokenRepository
} from './db-load-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) {}

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        const accessToken = await this.decrypter.decrypt(token);

        if (accessToken) {
            const account = await this.loadAccountByTokenRepository.loadByToken(
                token,
                role
            );

            return account;
        }

        return null;
    }
}
