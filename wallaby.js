module.exports = function () {
  return {
    files: ['src/kompose.js'],
    tests: ['test/kompose-test.js'],
    testFramework: 'tape',
    env: {
      type: 'node',
      runner: 'node'
    }
  };
};
