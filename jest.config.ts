import { InitialOptionsTsJest } from 'ts-jest/dist/types';

export default {
  preset: 'ts-jest',
  clearMocks: true,
  moduleDirectories: ['./node_modules/'],
  transformIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/dist/', '/__fixtures__/'],
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html-spa'],
  coverageProvider: 'v8',
  reporters: ['default'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
} as InitialOptionsTsJest;
