/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup } from 'src/core/public';
import { ManagementAppMountParams } from 'src/plugins/management/public';
import { i18n } from '@kbn/i18n';

import { ClientConfigType } from '../types';
import { httpService } from './services/http';
import { UiMetricService } from './services';
import { breadcrumbService, docTitleService } from './services/navigation';
import { AppDependencies } from './app_context';
import { renderApp } from '.';

export async function mountManagementSection(
  coreSetup: CoreSetup,
  services: {
    uiMetricService: UiMetricService;
  },
  config: ClientConfigType,
  params: ManagementAppMountParams
) {
  const { element, setBreadcrumbs, history } = params;
  const [core] = await coreSetup.getStartServices();
  const {
    chrome: { docTitle },
  } = core;

  docTitleService.setup(docTitle.change);
  breadcrumbService.setup(setBreadcrumbs);

  const appDependencies: AppDependencies = {
    core,
    config,
    services: {
      httpService,
      uiMetricService: services.uiMetricService,
      i18n,
      history,
    },
  };

  const unmountAppCallback = renderApp(element, appDependencies);

  return () => {
    docTitle.reset();
    unmountAppCallback();
  };
}
