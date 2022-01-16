import express from 'express';
import { setupApolloServer } from '@/main/graphql/apollo';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

const app = express();

setupApolloServer();
setupMiddlewares(app);
setupRoutes(app);

export default app;
