import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';
import { cors } from '../middlewares/cors';
import { contentType } from '../middlewares/content-type';

export function setupMiddlewares(app: Express): void {
    app.use(contentType);
    app.use(bodyParser);
    app.use(cors);
}
