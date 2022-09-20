/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isEmpty } from 'lodash/fp';
import { TimelineTypeLiteral } from '../../../../common/types/timeline';
import { appendSearch } from './helpers';

export const getTimelineTabsUrl = (tabName: TimelineTypeLiteral, search?: string) =>
  `/${tabName}${appendSearch(search)}`;

export const getTimelineUrl = (id: string, graphEventId?: string) =>
  `?timeline=(id:'${id}',isOpen:!t${
    isEmpty(graphEventId) ? ')' : `,graphEventId:'${graphEventId}')`
  }`;
