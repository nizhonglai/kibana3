/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

require('../src/setup_node_env/ensure_node_preserve_symlinks');
require('source-map-support/register');
require('@kbn/optimizer').runKbnOptimizerCli({
  defaultLimitsPath: require.resolve('../packages/kbn-optimizer/limits.yml'),
});
