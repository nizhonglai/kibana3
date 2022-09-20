/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import _ from 'lodash';
import { RequestHandler } from 'kibana/server';
import { TypeOf } from '@kbn/config-schema';
import { validateEntities } from '../../../../common/endpoint/schema/resolver';
import { ResolverEntityIndex, ResolverSchema } from '../../../../common/endpoint/types';

interface SupportedSchema {
  /**
   * A name for the schema being used
   */
  name: string;

  /**
   * A constraint to search for in the documented returned by Elasticsearch
   */
  constraints: Array<{ field: string; value: string }>;

  /**
   * Schema to return to the frontend so that it can be passed in to call to the /tree API
   */
  schema: ResolverSchema;
}

/**
 * This structure defines the preset supported schemas for a resolver graph. We'll probably want convert this
 * implementation to something similar to how row renderers is implemented.
 */
const supportedSchemas: SupportedSchema[] = [
  {
    name: 'endpoint',
    constraints: [
      {
        field: 'agent.type',
        value: 'endpoint',
      },
    ],
    schema: {
      id: 'process.entity_id',
      parent: 'process.parent.entity_id',
      ancestry: 'process.Ext.ancestry',
      name: 'process.name',
    },
  },
  {
    name: 'winlogbeat',
    constraints: [
      {
        field: 'agent.type',
        value: 'winlogbeat',
      },
      {
        field: 'event.module',
        value: 'sysmon',
      },
    ],
    schema: {
      id: 'process.entity_id',
      parent: 'process.parent.entity_id',
      name: 'process.name',
    },
  },
];

function getFieldAsString(doc: unknown, field: string): string | undefined {
  const value = _.get(doc, field);
  if (value === undefined) {
    return undefined;
  }

  return String(value);
}

/**
 * This is used to get an 'entity_id' which is an internal-to-Resolver concept, from an `_id`, which
 * is the artificial ID generated by ES for each document.
 */
export function handleEntities(): RequestHandler<unknown, TypeOf<typeof validateEntities.query>> {
  return async (context, request, response) => {
    const {
      query: { _id, indices },
    } = request;

    const queryResponse = await context.core.elasticsearch.client.asCurrentUser.search({
      ignore_unavailable: true,
      index: indices,
      body: {
        // only return 1 match at most
        size: 1,
        query: {
          bool: {
            filter: [
              {
                // only return documents with the matching _id
                ids: {
                  values: _id,
                },
              },
            ],
          },
        },
      },
    });

    const responseBody: ResolverEntityIndex = [];
    for (const hit of queryResponse.body.hits.hits) {
      for (const supportedSchema of supportedSchemas) {
        let foundSchema = true;
        // check that the constraint and id fields are defined and that the id field is not an empty string
        const id = getFieldAsString(hit._source, supportedSchema.schema.id);
        for (const constraint of supportedSchema.constraints) {
          const fieldValue = getFieldAsString(hit._source, constraint.field);
          // track that all the constraints are true, if one of them is false then this schema is not valid so mark it
          // that we did not find the schema
          foundSchema = foundSchema && fieldValue?.toLowerCase() === constraint.value.toLowerCase();
        }

        if (foundSchema && id !== undefined && id !== '') {
          responseBody.push({
            name: supportedSchema.name,
            schema: supportedSchema.schema,
            id,
          });
        }
      }
    }
    return response.ok({ body: responseBody });
  };
}
