/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { estypes } from '@elastic/elasticsearch';
import { elasticsearchServiceMock } from '../../elasticsearch/elasticsearch_service.mock';
import { isInlineScriptingDisabled } from './is_scripting_disabled';

describe('isInlineScriptingDisabled', () => {
  let client: ReturnType<typeof elasticsearchServiceMock.createElasticsearchClient>;

  beforeEach(() => {
    client = elasticsearchServiceMock.createElasticsearchClient();
  });

  const mockSettingsValue = (settings: estypes.ClusterGetSettingsResponse) => {
    client.cluster.getSettings.mockReturnValue(
      elasticsearchServiceMock.createSuccessTransportRequestPromise(settings)
    );
  };

  it('returns `false` if all settings are empty', async () => {
    mockSettingsValue({
      transient: {},
      persistent: {},
      defaults: {},
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(false);
  });

  it('returns `false` if `defaults.script.allowed_types` is `inline`', async () => {
    mockSettingsValue({
      transient: {},
      persistent: {},
      defaults: {
        'script.allowed_types': ['inline'],
      },
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(false);
  });

  it('returns `true` if `defaults.script.allowed_types` is `none`', async () => {
    mockSettingsValue({
      transient: {},
      persistent: {},
      defaults: {
        'script.allowed_types': ['none'],
      },
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(true);
  });

  it('returns `true` if `defaults.script.allowed_types` is `stored`', async () => {
    mockSettingsValue({
      transient: {},
      persistent: {},
      defaults: {
        'script.allowed_types': ['stored'],
      },
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(true);
  });

  it('respect the persistent->defaults priority', async () => {
    mockSettingsValue({
      transient: {},
      persistent: {
        'script.allowed_types': ['inline'],
      },
      defaults: {
        'script.allowed_types': ['stored'],
      },
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(false);
  });

  it('respect the transient->persistent priority', async () => {
    mockSettingsValue({
      transient: {
        'script.allowed_types': ['stored'],
      },
      persistent: {
        'script.allowed_types': ['inline'],
      },
      defaults: {},
    });

    expect(await isInlineScriptingDisabled({ client })).toEqual(true);
  });
});
