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
    'test'
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
