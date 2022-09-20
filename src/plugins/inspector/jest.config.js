/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

module.exports = {
  preset: '@kbn/test',
  rootDir: '../../..',
  roots: ['<rootDir>/src/plugins/inspector'],
  coverageDirectory: '<rootDir>/target/kibana-coverage/jest/src/plugins/inspector',
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: ['<rootDir>/src/plugins/inspector/{common,public}/**/*.{ts,tsx}'],
};
