import setupMiddlewares from '@/main/config/middlewares';
import setupRoutes from '@/main/config/routes';
import { setupApolloServer } from '@/main/graphql/apollo';

import express, { Express } from 'express';

export const setupApp = async (): Promise<Express> => {
    const app = express();

    setupMiddlewares(app);
    setupRoutes(app);

    const server = setupApolloServer();
    await server.start();

    server.applyMiddleware({ app });

    return app;
};
