import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory';

export default {
    Query: {
        surveyResult: async (parent: any, args: any) =>
            adaptResolver(makeLoadSurveyResultController(), args)
    },

    Mutation: {
        saveSurveyResult: async (parent: any, args: any) =>
            adaptResolver(makeSaveSurveyResultController(), args)
    }
};
