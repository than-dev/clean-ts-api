import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';

export function setupMiddlewares(app: Express): void {
    app.use(bodyParser);
}
