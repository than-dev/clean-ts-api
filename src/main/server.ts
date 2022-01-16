/* eslint-disable import/first */
import 'dotenv/config';
import { addAlias } from 'module-alias';
import { join } from 'path';

if (process.env.NODE_ENV === 'production') {
    addAlias('@', join(__dirname, '..'));
}

import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const app = (await import('./config/app')).default;
        app.listen(env.port, () =>
            console.log(`Server running at http://localhost:${env.port}`)
        );
    })
    .catch(console.error);
