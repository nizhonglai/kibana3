/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { lazy } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { I18nProvider } from '@kbn/i18n/react';
import { ClassNames } from '@emotion/react';
import { i18n } from '@kbn/i18n';
import { VisualizationContainer } from '../../../../visualizations/public';
import { ExpressionRenderDefinition } from '../../../../expressions/common/expression_renderers';
import { ExpressioTagcloudRendererDependencies } from '../plugin';
import { TagcloudRendererConfig } from '../../common/types';
import { EXPRESSION_NAME } from '../../common';

export const strings = {
  getDisplayName: () =>
    i18n.translate('expressionTagcloud.renderer.tagcloud.displayName', {
      defaultMessage: 'Tag Cloud visualization',
    }),
  getHelpDescription: () =>
    i18n.translate('expressionTagcloud.renderer.tagcloud.helpDescription', {
      defaultMessage: 'Render a tag cloud',
    }),
};

const tagCloudVisClass = {
  height: '100%',
};

const TagCloudChart = lazy(() => import('../components/tagcloud_component'));

export const tagcloudRenderer: (
  deps: ExpressioTagcloudRendererDependencies
) => ExpressionRenderDefinition<TagcloudRendererConfig> = ({ palettes }) => ({
  name: EXPRESSION_NAME,
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,
  render: async (domNode, config, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });
    const palettesRegistry = await palettes.getPalettes();

    const showNoResult = config.visData.rows.length === 0;

    render(
      <I18nProvider>
        <ClassNames>
          {({ css, cx }) => (
            <VisualizationContainer
              handlers={handlers}
              // Class `tagCloudContainer` is generated by `@emotion/react` and passed as a defined class to `VisualizationContainer`.
              // It is used for rendering at `Canvas`.
              className={cx('tagCloudContainer', css(tagCloudVisClass))}
              showNoResult={showNoResult}
            >
              <TagCloudChart
                {...config}
                palettesRegistry={palettesRegistry}
                renderComplete={handlers.done}
                fireEvent={handlers.event}
                syncColors={config.syncColors}
              />
            </VisualizationContainer>
          )}
        </ClassNames>
      </I18nProvider>,
      domNode
    );
  },
});
