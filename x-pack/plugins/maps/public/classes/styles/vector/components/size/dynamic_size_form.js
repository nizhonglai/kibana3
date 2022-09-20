/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Fragment } from 'react';
import { FieldSelect } from '../field_select';
import { SizeRangeSelector } from './size_range_selector';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';

export function DynamicSizeForm({
  fields,
  onDynamicStyleChange,
  staticDynamicSelect,
  styleProperty,
}) {
  const styleOptions = styleProperty.getOptions();

  const onFieldChange = ({ field }) => {
    onDynamicStyleChange(styleProperty.getStyleName(), { ...styleOptions, field });
  };

  const onSizeRangeChange = ({ minSize, maxSize }) => {
    onDynamicStyleChange(styleProperty.getStyleName(), {
      ...styleOptions,
      minSize,
      maxSize,
    });
  };

  let sizeRange;
  if (styleOptions.field && styleOptions.field.name) {
    sizeRange = (
      <SizeRangeSelector
        onChange={onSizeRangeChange}
        minSize={styleOptions.minSize}
        maxSize={styleOptions.maxSize}
        showLabels
        compressed
      />
    );
  }

  return (
    <Fragment>
      <EuiFlexGroup gutterSize="xs" justifyContent="flexEnd">
        <EuiFlexItem grow={false} className="mapStyleSettings__fixedBox">
          {staticDynamicSelect}
        </EuiFlexItem>
        <EuiFlexItem>
          <FieldSelect
            styleName={styleProperty.getStyleName()}
            fields={fields}
            selectedFieldName={styleProperty.getFieldName()}
            onChange={onFieldChange}
            compressed
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="s" />
      {sizeRange}
    </Fragment>
  );
}
