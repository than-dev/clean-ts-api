import { setupApp } from '@/main/config/app';

import { Express } from 'express';
import request from 'supertest';

let app: Express;

describe('Body Parser Middleware', () => {
    beforeAll(async () => {
        app = await setupApp();
    });

    it('should parse body as json', async () => {
        app.post('/it_body_parser', (req, res) => {
            res.send(req.body);
        });
        await request(app)
            .post('/it_body_parser')
            .send({ name: 'Rodrigo' })
            .expect({ name: 'Rodrigo' });
    });
});
