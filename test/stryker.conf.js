module.exports = function(config) {
  config.set({
    files: [
      {pattern: 'src/**/*.js', included: false, mutated: true},
      'test/unit/**/*.js',
    ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    testSelector: null,
    //logLevel: 'trace',
    reporter: ['clear-text'],
    coverageAnalysis: 'perTest',
    plugins: ['stryker-mocha-runner']
  });
}