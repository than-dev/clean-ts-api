import express from 'express';
import { setupAppolloServer } from './apollo-server';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

const app = express();

setupAppolloServer(app);
setupMiddlewares(app);
setupRoutes(app);

export default app;
