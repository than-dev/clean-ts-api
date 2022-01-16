import request from 'supertest';
import app from '@/main/config/app';

describe('Body Parser Middleware', () => {
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
