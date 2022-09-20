/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { HttpFetchOptionsWithPath } from 'kibana/public';
import {
  httpHandlerMockFactory,
  ResponseProvidersInterface,
} from '../../../common/mock/endpoint/http_handler_mock_factory';
import {
  GetTrustedAppsListRequest,
  GetTrustedAppsListResponse,
  PutTrustedAppUpdateRequest,
  PutTrustedAppUpdateResponse,
} from '../../../../common/endpoint/types';
import {
  TRUSTED_APPS_LIST_API,
  TRUSTED_APPS_UPDATE_API,
} from '../../../../common/endpoint/constants';
import { TrustedAppGenerator } from '../../../../common/endpoint/data_generators/trusted_app_generator';

export type PolicyDetailsGetTrustedAppsListHttpMocksInterface = ResponseProvidersInterface<{
  trustedAppsList: (options: HttpFetchOptionsWithPath) => GetTrustedAppsListResponse;
}>;
/**
 * HTTP mock for retrieving list of Trusted Apps
 */
export const trustedAppsGetListHttpMocks =
  httpHandlerMockFactory<PolicyDetailsGetTrustedAppsListHttpMocksInterface>([
    {
      id: 'trustedAppsList',
      path: TRUSTED_APPS_LIST_API,
      method: 'get',
      handler: ({ query }): GetTrustedAppsListResponse => {
        const apiQueryParams = query as GetTrustedAppsListRequest;
        const generator = new TrustedAppGenerator('seed');
        const perPage = apiQueryParams.per_page ?? 10;
        const data = Array.from({ length: Math.min(perPage, 50) }, () => generator.generate());

        // Change the 3rd entry (index 2) to be policy specific
        data[2].effectScope = {
          type: 'policy',
          policies: [
            // IDs below are those generated by the `fleetGetEndpointPackagePolicyListHttpMock()` mock
            'ddf6570b-9175-4a6d-b288-61a09771c647',
            'b8e616ae-44fc-4be7-846c-ce8fa5c082dd',
          ],
        };

        return {
          page: apiQueryParams.page ?? 1,
          per_page: perPage,
          total: 20,
          data,
        };
      },
    },
  ]);

export type TrustedAppPutHttpMocksInterface = ResponseProvidersInterface<{
  trustedAppUpdate: (options: HttpFetchOptionsWithPath) => PutTrustedAppUpdateResponse;
}>;
/**
 * HTTP mocks that support updating a single Trusted Apps
 */
export const trustedAppPutHttpMocks = httpHandlerMockFactory<TrustedAppPutHttpMocksInterface>([
  {
    id: 'trustedAppUpdate',
    path: TRUSTED_APPS_UPDATE_API,
    method: 'put',
    handler: ({ body, path }): PutTrustedAppUpdateResponse => {
      const response: PutTrustedAppUpdateResponse = {
        data: {
          ...(body as unknown as PutTrustedAppUpdateRequest),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: path.split('/').pop()!,
          created_at: '2021-10-12T16:02:55.856Z',
          created_by: 'elastic',
          updated_at: '2021-10-13T16:02:55.856Z',
          updated_by: 'elastic',
          version: 'abc',
        },
      };

      return response;
    },
  },
]);
