module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy' // mockt CSS-modules (werkt ook met className gebruik)
    },
  };
  