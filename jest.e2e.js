// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('./jest.config');

module.exports = {
  ...sharedConfig,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testTimeout: 15000,
  // testMatch: ['<rootDir>/**/*.e2e-spec.ts'],
  testMatch: ['<rootDir>/src/**/test/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
