import { Secret, sign } from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter {
    constructor(private readonly secret: Secret) {}

    async encrypt(value: string): Promise<string> {
        const accessToken = sign({ id: value }, this.secret);
        return accessToken;
    }
}
