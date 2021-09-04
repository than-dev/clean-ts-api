export interface UpdateAccessTokenRepository {
    updateAccessTokenAccessToken(id: string, token: string): Promise<void>;
}
