/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json' }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/styleMock.ts',
    '\\.(gif|ttf|eot|svg|png|mp3|wav)$': '<rootDir>/src/test/fileMock.ts',
    '^html-to-image$': '<rootDir>/src/test/htmlToImageMock.ts'
  },
  clearMocks: true
};
