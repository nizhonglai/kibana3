/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const mockTemplate = {
  columns: [
    {
      columnHeaderType: 'not-filtered',
      indexes: null,
      id: '@timestamp',
      name: null,
      searchable: null,
    },
    {
      columnHeaderType: 'not-filtered',
      indexes: null,
      id: 'signal.rule.description',
      name: null,
      searchable: null,
    },
    {
      columnHeaderType: 'not-filtered',
      indexes: null,
      id: 'event.action',
      name: null,
      searchable: null,
    },
    {
      columnHeaderType: 'not-filtered',
      indexes: null,
      id: 'process.name',
      name: null,
      searchable: null,
    },
    {
      aggregatable: true,
      category: 'process',
      columnHeaderType: 'not-filtered',
      description: 'The working directory of the process.',
      example: '/home/alice',
      indexes: null,
      id: 'process.working_directory',
      name: null,
      searchable: null,
      type: 'string',
    },
    {
      aggregatable: true,
      category: 'process',
      columnHeaderType: 'not-filtered',
      description:
        'Array of process arguments, starting with the absolute path to\nthe executable.\n\nMay be filtered to protect sensitive information.',
      example: '["/usr/bin/ssh","-l","user","10.0.0.16"]',
      indexes: null,
      id: 'process.args',
      name: null,
      searchable: null,
      type: 'string',
    },
    {
      columnHeaderType: 'not-filtered',
      indexes: null,
      id: 'process.pid',
      name: null,
      searchable: null,
    },
    {
      aggregatable: true,
      category: 'process',
      columnHeaderType: 'not-filtered',
      description: 'Absolute path to the process executable.',
      example: '/usr/bin/ssh',
      indexes: null,
      id: 'process.parent.executable',
      name: null,
      searchable: null,
      type: 'string',
    },
    {
      aggregatable: true,
      category: 'process',
      columnHeaderType: 'not-filtered',
      description:
        'Array of process arguments.\n\nMay be filtered to protect sensitive information.',
      example: '["ssh","-l","user","10.0.0.16"]',
      indexes: null,
      id: 'process.parent.args',
      name: null,
      searchable: null,
      type: 'string',
    },
    {
      aggregatable: true,
      category: 'process',
      columnHeaderType: 'not-filtered',
      description: 'Process id.',
      example: '4242',
      indexes: null,
      id: 'process.parent.pid',
      name: null,
      searchable: null,
      type: 'number',
    },
    {
      aggregatable: true,
      category: 'user',
      columnHeaderType: 'not-filtered',
      description: 'Short name or login of the user.',
      example: 'albert',
      indexes: null,
      id: 'user.name',
      name: null,
      searchable: null,
      type: 'string',
    },
    {
      aggregatable: true,
      category: 'host',
      columnHeaderType: 'not-filtered',
      description:
        'Name of the host.\n\nIt can contain what `hostname` returns on Unix systems, the fully qualified\ndomain name, or a name specified by the user. The sender decides which value\nto use.',
      indexes: null,
      id: 'host.name',
      name: null,
      searchable: null,
      type: 'string',
    },
  ],
  dataProviders: [
    {
      id: 'timeline-1-8622010a-61fb-490d-b162-beac9c36a853',
      name: '{process.name}',
      enabled: true,
      excluded: false,
      kqlQuery: '',
      type: 'template',
      queryMatch: {
        field: 'process.name',
        displayField: null,
        value: '{process.name}',
        displayValue: null,
        operator: ':',
      },
      and: [],
    },
    {
      id: 'timeline-1-4685da24-35c1-43f3-892d-1f926dbf5568',
      name: '{event.type}',
      enabled: true,
      excluded: false,
      kqlQuery: '',
      type: 'template',
      queryMatch: {
        field: 'event.type',
        displayField: null,
        value: '{event.type}',
        displayValue: null,
        operator: ':*',
      },
      and: [],
    },
  ],
  description: '',
  eventType: 'all',
  excludedRowRendererIds: [],
  filters: [],
  kqlMode: 'filter',
  kqlQuery: { filterQuery: { kuery: { kind: 'kuery', expression: '' }, serializedQuery: '' } },
  indexNames: [],
  title: 'Generic Process Timeline - Duplicate - Duplicate',
  timelineType: 'template',
  templateTimelineVersion: null,
  templateTimelineId: null,
  dateRange: { start: '2020-10-01T11:37:31.655Z', end: '2020-10-02T11:37:31.655Z' },
  savedQueryId: null,
  sort: { columnId: '@timestamp', sortDirection: 'desc' },
  status: 'active',
};

export const mockTimeline = {
  columns: [
    { columnHeaderType: 'not-filtered', id: '@timestamp' },
    { columnHeaderType: 'not-filtered', id: 'message' },
    { columnHeaderType: 'not-filtered', id: 'event.category' },
    { columnHeaderType: 'not-filtered', id: 'event.action' },
    { columnHeaderType: 'not-filtered', id: 'host.name' },
    { columnHeaderType: 'not-filtered', id: 'source.ip' },
    { columnHeaderType: 'not-filtered', id: 'destination.ip' },
    { columnHeaderType: 'not-filtered', id: 'user.name' },
  ],
  dataProviders: [],
  description: '',
  eventType: 'all',
  excludedRowRendererIds: [],
  filters: [],
  kqlMode: 'filter',
  kqlQuery: { filterQuery: null },
  indexNames: [
    'auditbeat-*',
    'endgame-*',
    'filebeat-*',
    'logs-*',
    'packetbeat-*',
    'winlogbeat-*',
    '.siem-signals-angelachuang-default',
  ],
  title: 'my timeline',
  timelineType: 'default',
  templateTimelineVersion: null,
  templateTimelineId: null,
  dateRange: { start: '2020-11-03T13:34:40.339Z', end: '2020-11-04T13:34:40.339Z' },
  savedQueryId: null,
  sort: { columnId: '@timestamp', columnType: 'number', sortDirection: 'desc' },
  status: 'draft',
};
