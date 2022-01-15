module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  coveragePathIgnorePatterns: [
    'node_modules',
    'protocols',
    'main',
    'test',
    'src/infra/db/mongodb/helpers/query-builder.ts'
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
