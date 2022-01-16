import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { Hasher } from '@/data/protocols/criptography/hasher';

export const mockHasher = (): Hasher => {
    class HasherSpy implements Hasher {
        async hash(value: string): Promise<string> {
            return Promise.resolve('hashed_password');
        }
    }
    return new HasherSpy();
};

export const mockDecrypter = (): Decrypter => {
    class DecrypterSpy implements Decrypter {
        async decrypt(token: string): Promise<string> {
            return Promise.resolve('any_value');
        }
    }

    return new DecrypterSpy();
};

export const mockEncrypter = (): Encrypter => {
    class EncrypterSpy implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve('any_token');
        }
    }
    return new EncrypterSpy();
};

export const mockHashComparer = (): HashComparer => {
    class HashComparerSpy implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return Promise.resolve(true);
        }
    }
    return new HashComparerSpy();
};
