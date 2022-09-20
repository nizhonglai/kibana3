/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { usageCountersServiceMock } from 'src/plugins/usage_collection/server/usage_counters/usage_counters_service.mock';
import { unmuteAllAlertRoute } from './unmute_all';
import { httpServiceMock } from 'src/core/server/mocks';
import { licenseStateMock } from '../../lib/license_state.mock';
import { mockHandlerArguments } from './../_mock_handler_arguments';
import { rulesClientMock } from '../../rules_client.mock';
import { AlertTypeDisabledError } from '../../lib/errors/alert_type_disabled';
import { trackLegacyRouteUsage } from '../../lib/track_legacy_route_usage';

const rulesClient = rulesClientMock.create();
jest.mock('../../lib/license_api_access.ts', () => ({
  verifyApiAccess: jest.fn(),
}));

jest.mock('../../lib/track_legacy_route_usage', () => ({
  trackLegacyRouteUsage: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('unmuteAllAlertRoute', () => {
  it('unmutes an alert', async () => {
    const licenseState = licenseStateMock.create();
    const router = httpServiceMock.createRouter();

    unmuteAllAlertRoute(router, licenseState);

    const [config, handler] = router.post.mock.calls[0];

    expect(config.path).toMatchInlineSnapshot(`"/api/alerts/alert/{id}/_unmute_all"`);

    rulesClient.unmuteAll.mockResolvedValueOnce();

    const [context, req, res] = mockHandlerArguments(
      { rulesClient },
      {
        params: {
          id: '1',
        },
      },
      ['noContent']
    );

    expect(await handler(context, req, res)).toEqual(undefined);

    expect(rulesClient.unmuteAll).toHaveBeenCalledTimes(1);
    expect(rulesClient.unmuteAll.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "1",
        },
      ]
    `);

    expect(res.noContent).toHaveBeenCalled();
  });

  it('ensures the alert type gets validated for the license', async () => {
    const licenseState = licenseStateMock.create();
    const router = httpServiceMock.createRouter();

    unmuteAllAlertRoute(router, licenseState);

    const [, handler] = router.post.mock.calls[0];

    rulesClient.unmuteAll.mockRejectedValue(new AlertTypeDisabledError('Fail', 'license_invalid'));

    const [context, req, res] = mockHandlerArguments({ rulesClient }, { params: {}, body: {} }, [
      'ok',
      'forbidden',
    ]);

    await handler(context, req, res);

    expect(res.forbidden).toHaveBeenCalledWith({ body: { message: 'Fail' } });
  });

  it('should track every call', async () => {
    const licenseState = licenseStateMock.create();
    const router = httpServiceMock.createRouter();
    const mockUsageCountersSetup = usageCountersServiceMock.createSetupContract();
    const mockUsageCounter = mockUsageCountersSetup.createUsageCounter('test');

    unmuteAllAlertRoute(router, licenseState, mockUsageCounter);
    const [, handler] = router.post.mock.calls[0];
    const [context, req, res] = mockHandlerArguments({ rulesClient }, { params: {}, body: {} }, [
      'ok',
    ]);
    await handler(context, req, res);
    expect(trackLegacyRouteUsage).toHaveBeenCalledWith('unmuteAll', mockUsageCounter);
  });
});
