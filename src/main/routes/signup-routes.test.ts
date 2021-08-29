import { app } from '../config/app';
import request from 'supertest';

describe('SignUp Routes', () => {
    it('should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Nathan',
                email: 'nathan.cotrim@gmail.com',
                password: 'valid_pass',
                passwordConfirmation: 'valid_pass'
            })
            .expect(200);
    });
});
