/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginConfigDescriptor, PluginInitializerContext } from '../../../../src/core/server';

import { ConfigSchema } from './config';
import { ListPlugin } from './plugin';

// exporting these since its required at top level in siem plugin
export { ListClient } from './services/lists/list_client';
export type {
  CreateExceptionListItemOptions,
  UpdateExceptionListItemOptions,
} from './services/exception_lists/exception_list_client_types';
export { ExceptionListClient } from './services/exception_lists/exception_list_client';
export type { ListPluginSetup, ListsApiRequestHandlerContext } from './types';
export type { ExportExceptionListAndItemsReturn } from './services/exception_lists/export_exception_list_and_items';

export const config: PluginConfigDescriptor = {
  deprecations: ({ deprecate }) => [deprecate('enabled', '8.0.0')],
  schema: ConfigSchema,
};
export const plugin = (initializerContext: PluginInitializerContext): ListPlugin =>
  new ListPlugin(initializerContext);
