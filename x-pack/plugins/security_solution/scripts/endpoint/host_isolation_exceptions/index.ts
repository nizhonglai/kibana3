/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { run, RunFn, createFailError } from '@kbn/dev-utils';
import { KbnClient } from '@kbn/test';
import { AxiosError } from 'axios';
import bluebird from 'bluebird';
import type { CreateExceptionListSchema } from '@kbn/securitysolution-io-ts-list-types';
import {
  ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_DESCRIPTION,
  ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID,
  ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_NAME,
  EXCEPTION_LIST_ITEM_URL,
  EXCEPTION_LIST_URL,
} from '@kbn/securitysolution-list-constants';
import { HostIsolationExceptionGenerator } from '../../../common/endpoint/data_generators/host_isolation_exception_generator';

export const cli = () => {
  run(
    async (options) => {
      try {
        await createHostIsolationException(options);
        options.log.success(`${options.flags.count} endpoint host isolation exceptions`);
      } catch (e) {
        options.log.error(e);
        throw createFailError(e.message);
      }
    },
    {
      description: 'Load Host isolation exceptions',
      flags: {
        string: ['kibana'],
        default: {
          count: 10,
          kibana: 'http://elastic:changeme@localhost:5601',
        },
        help: `
        --count            Number of host isolation exceptions to create. Default: 10
        --kibana           The URL to kibana including credentials. Default: http://elastic:changeme@localhost:5601
      `,
      },
    }
  );
};

class EventFilterDataLoaderError extends Error {
  constructor(message: string, public readonly meta: unknown) {
    super(message);
  }
}

const handleThrowAxiosHttpError = (err: AxiosError<{ message?: string }>): never => {
  let message = err.message;

  if (err.response) {
    message = `[${err.response.status}] ${err.response.data.message ?? err.message} [ ${String(
      err.response.config.method
    ).toUpperCase()} ${err.response.config.url} ]`;
  }
  throw new EventFilterDataLoaderError(message, err.toJSON());
};

const createHostIsolationException: RunFn = async ({ flags, log }) => {
  const eventGenerator = new HostIsolationExceptionGenerator();
  const kbn = new KbnClient({ log, url: flags.kibana as string });

  await ensureCreateEndpointHostIsolationExceptionList(kbn);

  await bluebird.map(
    Array.from({ length: flags.count as unknown as number }),
    () =>
      kbn
        .request({
          method: 'POST',
          path: EXCEPTION_LIST_ITEM_URL,
          body: eventGenerator.generate(),
        })
        .catch((e) => handleThrowAxiosHttpError(e)),
    { concurrency: 10 }
  );
};

const ensureCreateEndpointHostIsolationExceptionList = async (kbn: KbnClient) => {
  const newListDefinition: CreateExceptionListSchema = {
    description: ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_DESCRIPTION,
    list_id: ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID,
    meta: undefined,
    name: ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_NAME,
    os_types: [],
    tags: [],
    type: 'endpoint',
    namespace_type: 'agnostic',
  };

  await kbn
    .request({
      method: 'POST',
      path: EXCEPTION_LIST_URL,
      body: newListDefinition,
    })
    .catch((e) => {
      // Ignore if list was already created
      if (e.response.status !== 409) {
        handleThrowAxiosHttpError(e);
      }
    });
};
