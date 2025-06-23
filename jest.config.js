module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.env-setup.js'],
    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy'
    }
  };
  