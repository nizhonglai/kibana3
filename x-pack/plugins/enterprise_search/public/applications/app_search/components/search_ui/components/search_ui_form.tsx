/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { useValues, useActions } from 'kea';

import { EuiForm, EuiFormRow, EuiSelect, EuiComboBox, EuiButton } from '@elastic/eui';

import { EngineLogic } from '../../engine';
import {
  TITLE_FIELD_LABEL,
  TITLE_FIELD_HELP_TEXT,
  FILTER_FIELD_LABEL,
  FILTER_FIELD_HELP_TEXT,
  SORT_FIELD_LABEL,
  SORT_FIELD_HELP_TEXT,
  URL_FIELD_LABEL,
  URL_FIELD_HELP_TEXT,
  GENERATE_PREVIEW_BUTTON_LABEL,
  THUMBNAIL_FIELD_LABEL,
  THUMBNAIL_FIELD_HELP_TEXT,
} from '../i18n';
import { SearchUILogic } from '../search_ui_logic';
import { ActiveField } from '../types';
import { generatePreviewUrl } from '../utils';

export const SearchUIForm: React.FC = () => {
  const { searchKey } = useValues(EngineLogic);
  const {
    dataLoading,
    validFields,
    validSortFields,
    validFacetFields,
    titleField,
    urlField,
    thumbnailField,
    facetFields,
    sortFields,
  } = useValues(SearchUILogic);
  const {
    onActiveFieldChange,
    onFacetFieldsChange,
    onSortFieldsChange,
    onTitleFieldChange,
    onUrlFieldChange,
    onThumbnailFieldChange,
  } = useActions(SearchUILogic);

  const previewHref = generatePreviewUrl({
    titleField,
    urlField,
    thumbnailField,
    facets: facetFields,
    sortFields,
  });

  const formatSelectOption = (fieldName: string) => {
    return { text: fieldName, value: fieldName };
  };
  const formatMultiOptions = (fieldNames: string[]) =>
    fieldNames.map((fieldName) => ({ label: fieldName, text: fieldName, value: fieldName }));
  const formatMultiOptionsWithEmptyOption = (fieldNames: string[]) => [
    { label: '', text: '', value: '' },
    ...formatMultiOptions(fieldNames),
  ];

  const optionFields = formatMultiOptionsWithEmptyOption(validFields);
  const sortOptionFields = formatMultiOptions(validSortFields);
  const facetOptionFields = formatMultiOptions(validFacetFields);
  const selectedTitleOption = formatSelectOption(titleField);
  const selectedURLOption = formatSelectOption(urlField);
  const selectedThumbnailOption = formatSelectOption(thumbnailField);
  const selectedSortOptions = formatMultiOptions(sortFields);
  const selectedFacetOptions = formatMultiOptions(facetFields);

  return (
    <EuiForm component="form" action={previewHref} target="_blank" method="POST">
      <input type="hidden" id="searchKey" name="searchKey" value={searchKey} />
      <EuiFormRow label={TITLE_FIELD_LABEL} helpText={TITLE_FIELD_HELP_TEXT} fullWidth>
        <EuiSelect
          disabled={dataLoading}
          options={optionFields}
          value={selectedTitleOption && selectedTitleOption.value}
          onChange={(e) => onTitleFieldChange(e.target.value)}
          fullWidth
          onFocus={() => onActiveFieldChange(ActiveField.Title)}
          onBlur={() => onActiveFieldChange(ActiveField.None)}
          hasNoInitialSelection
          data-test-subj="selectTitle"
        />
      </EuiFormRow>
      <EuiFormRow label={FILTER_FIELD_LABEL} helpText={FILTER_FIELD_HELP_TEXT} fullWidth>
        <EuiComboBox
          isDisabled={dataLoading}
          options={facetOptionFields}
          selectedOptions={selectedFacetOptions}
          onChange={(newValues) => onFacetFieldsChange(newValues.map((field) => field.value!))}
          onFocus={() => onActiveFieldChange(ActiveField.Filter)}
          onBlur={() => onActiveFieldChange(ActiveField.None)}
          fullWidth
          data-test-subj="selectFilters"
        />
      </EuiFormRow>
      <EuiFormRow label={SORT_FIELD_LABEL} helpText={SORT_FIELD_HELP_TEXT} fullWidth>
        <EuiComboBox
          isDisabled={dataLoading}
          options={sortOptionFields}
          selectedOptions={selectedSortOptions}
          onChange={(newValues) => onSortFieldsChange(newValues.map((field) => field.value!))}
          onFocus={() => onActiveFieldChange(ActiveField.Sort)}
          onBlur={() => onActiveFieldChange(ActiveField.None)}
          fullWidth
          data-test-subj="selectSort"
        />
      </EuiFormRow>
      <EuiFormRow label={URL_FIELD_LABEL} helpText={URL_FIELD_HELP_TEXT} fullWidth>
        <EuiSelect
          disabled={dataLoading}
          options={optionFields}
          value={selectedURLOption && selectedURLOption.value}
          onChange={(e) => onUrlFieldChange(e.target.value)}
          fullWidth
          onFocus={() => onActiveFieldChange(ActiveField.Url)}
          onBlur={() => onActiveFieldChange(ActiveField.None)}
          hasNoInitialSelection
          data-test-subj="selectUrl"
        />
      </EuiFormRow>
      <EuiFormRow label={THUMBNAIL_FIELD_LABEL} helpText={THUMBNAIL_FIELD_HELP_TEXT} fullWidth>
        <EuiSelect
          disabled={dataLoading}
          options={optionFields}
          value={selectedThumbnailOption && selectedThumbnailOption.value}
          onChange={(e) => onThumbnailFieldChange(e.target.value)}
          fullWidth
          onFocus={() => onActiveFieldChange(ActiveField.Thumb)}
          onBlur={() => onActiveFieldChange(ActiveField.None)}
          hasNoInitialSelection
          data-test-subj="selectThumbnail"
        />
      </EuiFormRow>
      <EuiButton
        disabled={dataLoading}
        type="submit"
        fill
        iconType="popout"
        iconSide="right"
        data-test-subj="generateSearchUiPreview"
      >
        {GENERATE_PREVIEW_BUTTON_LABEL}
      </EuiButton>
    </EuiForm>
  );
};
