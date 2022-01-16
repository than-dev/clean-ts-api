/* eslint-disable @typescript-eslint/no-misused-promises */
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';

import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return Promise.resolve('hash');
    },

    async compare(): Promise<boolean> {
        return Promise.resolve(true);
    }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
    describe('hash()', () => {
        it('should call hash with correct values', async () => {
            const sut = makeSut();
            const hashSpy = jest.spyOn(bcrypt, 'hash');
            await sut.hash('any_value');
            expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
        });

        it('should return a valid hash on hash success', async () => {
            const sut = makeSut();
            const hash = await sut.hash('any_value');
            expect(hash).toBe('hash');
        });

        it('should throw if hash throws', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
                async () =>
                    new Promise((resolve, reject) => reject(new Error()))
            );
            const promise = sut.hash('any_value');
            await expect(promise).rejects.toThrow();
        });
    });

    describe('compare()', () => {
        it('should call compare with correct values', async () => {
            const sut = makeSut();
            const compareSpy = jest.spyOn(bcrypt, 'compare');
            await sut.compare('any_value', 'any_hash');
            expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
        });

        it('should return true when compare succeeds', async () => {
            const sut = makeSut();
            const isValid = await sut.compare('any_value', 'any_hash');
            expect(isValid).toBe(true);
        });

        it('should return false when compare fails', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () =>
                Promise.resolve()
            );
            const isValid = await sut.compare('any_value', 'any_hash');
            expect(isValid).toBe(undefined);
        });

        it('should throw if compare throws', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
                async () =>
                    new Promise((resolve, reject) => reject(new Error()))
            );
            const promise = sut.compare('any_value', 'any_hash');
            await expect(promise).rejects.toThrow();
        });
    });
});
