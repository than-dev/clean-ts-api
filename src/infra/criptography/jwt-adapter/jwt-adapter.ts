import { Secret, sign } from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter {
    private readonly secret: Secret;

    constructor(secret: Secret) {
        this.secret = secret;
    }

    async encrypt(value: string): Promise<string> {
        const accessToken = sign({ id: value }, this.secret);
        return accessToken;
    }
}
