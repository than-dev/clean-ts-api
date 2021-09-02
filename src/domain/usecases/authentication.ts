export interface Authentication {
    auth(authentication: AuthenticationModel): Promise<string>;
}

export interface AuthenticationModel {
    email: string;
    password: string;
}
