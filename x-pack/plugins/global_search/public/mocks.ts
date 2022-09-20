/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { GlobalSearchPluginSetup, GlobalSearchPluginStart } from './types';
import { searchServiceMock } from './services/search_service.mock';

const createSetupMock = (): jest.Mocked<GlobalSearchPluginSetup> => {
  const searchMock = searchServiceMock.createSetupContract();

  return {
    registerResultProvider: searchMock.registerResultProvider,
  };
};

const createStartMock = (): jest.Mocked<GlobalSearchPluginStart> => {
  const searchMock = searchServiceMock.createStartContract();

  return {
    find: searchMock.find,
    getSearchableTypes: searchMock.getSearchableTypes,
  };
};

export const globalSearchPluginMock = {
  createSetupContract: createSetupMock,
  createStartContract: createStartMock,
};
