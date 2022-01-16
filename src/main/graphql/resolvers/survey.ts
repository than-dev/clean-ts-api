import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';

export default {
    Query: {
        surveys: async () => adaptResolver(makeLoadSurveysController())
    }
};
