import {
    LoadAccountByEmailRepository,
    AuthenticationModel,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository,
    Authentication
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
    private readonly loadByEmailAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly encrypter: Encrypter;
    private readonly updateAccessTokenAccessTokenRepository: UpdateAccessTokenRepository;

    constructor(
        loadByEmailAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
        updateAccessTokenAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadByEmailAccountByEmailRepository =
            loadByEmailAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
        this.updateAccessTokenAccessTokenRepository =
            updateAccessTokenAccessTokenRepository;
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account =
            await this.loadByEmailAccountByEmailRepository.loadByEmail(
                authentication.email
            );

        if (account) {
            const isValid = await this.hashComparer.compare(
                authentication.password,
                account.password
            );
            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id);
                await this.updateAccessTokenAccessTokenRepository.updateAccessToken(
                    account.id,
                    accessToken
                );
                return accessToken;
            }
        }

        return '';
    }
}
