/* eslint-disable node/no-path-concat */
import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

export function setupRoutes(app: Express): void {
    const router = Router();
    app.use('/api', router);
    readdirSync(join(__dirname, '../routes')).map(async (file) => {
        if (!file.includes('.test.') && !file.endsWith('.map')) {
            (await import(`../routes/${file}`)).default(router);
        }
    });
}
