import { gql } from 'apollo-server-express';

export default gql`
    directive @auth on FIELD_DEFINITION
    scalar DateTime

    type Query {
        _: String
    }

    type Mutation {
        _: String
    }
`;
