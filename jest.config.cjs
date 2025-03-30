module.exports = {
    preset: 'ts-jest', // Use ts-jest to handle TypeScript
    testEnvironment: 'jsdom', // Use 'jsdom' if testing DOM-related code (e.g., React components)
    roots: ['./src/tests'], // Where to look for tests
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'], // Match test files like *.test.ts
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./src/setupTests.ts'], // Optional setup file
};