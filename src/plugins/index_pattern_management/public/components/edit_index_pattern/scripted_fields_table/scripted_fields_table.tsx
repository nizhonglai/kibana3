/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component } from 'react';
import { EuiSpacer } from '@elastic/eui';
import {
  getSupportedScriptingLanguages,
  getDeprecatedScriptingLanguages,
} from '../../../scripting_languages';

import { Table, Header, CallOuts, DeleteScritpedFieldConfirmationModal } from './components';
import { ScriptedFieldItem } from './types';
import { IndexPatternManagmentContext } from '../../../types';

import { IndexPattern, DataPublicPluginStart } from '../../../../../../plugins/data/public';
import { useKibana } from '../../../../../../plugins/kibana_react/public';

interface ScriptedFieldsTableProps {
  indexPattern: IndexPattern;
  fieldFilter?: string;
  scriptedFieldLanguageFilter?: string;
  helpers: {
    redirectToRoute: Function;
    getRouteHref?: Function;
  };
  onRemoveField?: () => void;
  painlessDocLink: string;
  saveIndexPattern: DataPublicPluginStart['indexPatterns']['updateSavedObject'];
  userEditPermission: boolean;
}

interface ScriptedFieldsTableState {
  deprecatedLangsInUse: string[];
  fieldToDelete: ScriptedFieldItem | undefined;
  isDeleteConfirmationModalVisible: boolean;
  fields: ScriptedFieldItem[];
}

const withHooks = (Comp: typeof Component) => {
  return (props: any) => {
    const { application } = useKibana<IndexPatternManagmentContext>().services;
    const userEditPermission = !!application?.capabilities?.indexPatterns?.save;

    return <Comp userEditPermission={userEditPermission} {...props} />;
  };
};

class ScriptedFields extends Component<ScriptedFieldsTableProps, ScriptedFieldsTableState> {
  constructor(props: ScriptedFieldsTableProps) {
    super(props);

    this.state = {
      deprecatedLangsInUse: [],
      fieldToDelete: undefined,
      isDeleteConfirmationModalVisible: false,
      fields: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchFields();
  }

  fetchFields = async () => {
    const fields = await (this.props.indexPattern.getScriptedFields() as ScriptedFieldItem[]);

    const deprecatedLangsInUse = [];
    const deprecatedLangs = getDeprecatedScriptingLanguages();
    const supportedLangs = getSupportedScriptingLanguages();

    for (const field of fields) {
      const lang = field.lang;
      if (deprecatedLangs.includes(lang) || !supportedLangs.includes(lang)) {
        deprecatedLangsInUse.push(lang);
      }
    }

    this.setState({
      fields,
      deprecatedLangsInUse,
    });
  };

  getFilteredItems = () => {
    const { fields } = this.state;
    const { fieldFilter, scriptedFieldLanguageFilter, userEditPermission } = this.props;

    let languageFilteredFields = fields;

    if (scriptedFieldLanguageFilter) {
      languageFilteredFields = fields.filter(
        (field) => field.lang === this.props.scriptedFieldLanguageFilter
      );
    }

    let filteredFields = languageFilteredFields;

    if (fieldFilter) {
      const normalizedFieldFilter = fieldFilter.toLowerCase();

      filteredFields = languageFilteredFields.filter((field) =>
        field.name.toLowerCase().includes(normalizedFieldFilter)
      );
    }

    filteredFields.forEach((field) => (field.isUserEditable = userEditPermission));

    return filteredFields;
  };

  startDeleteField = (field: ScriptedFieldItem) => {
    this.setState({ fieldToDelete: field, isDeleteConfirmationModalVisible: true });
  };

  hideDeleteConfirmationModal = () => {
    this.setState({ fieldToDelete: undefined, isDeleteConfirmationModalVisible: false });
  };

  deleteField = () => {
    const { indexPattern, onRemoveField, saveIndexPattern } = this.props;
    const { fieldToDelete } = this.state;

    indexPattern.removeScriptedField(fieldToDelete!.name);
    saveIndexPattern(indexPattern);

    if (onRemoveField) {
      onRemoveField();
    }

    this.fetchFields();
    this.hideDeleteConfirmationModal();
  };

  render() {
    const { indexPattern, painlessDocLink } = this.props;
    const { fieldToDelete, deprecatedLangsInUse } = this.state;

    const items = this.getFilteredItems();

    return (
      <>
        <Header indexPatternId={indexPattern.id || ''} />

        <CallOuts deprecatedLangsInUse={deprecatedLangsInUse} painlessDocLink={painlessDocLink} />

        <EuiSpacer size="l" />

        <Table
          indexPattern={indexPattern}
          items={items}
          editField={(field) => this.props.helpers.redirectToRoute(field)}
          deleteField={this.startDeleteField}
        />

        {fieldToDelete && (
          <DeleteScritpedFieldConfirmationModal
            deleteField={this.deleteField}
            field={fieldToDelete}
            hideDeleteConfirmationModal={this.hideDeleteConfirmationModal}
          />
        )}
      </>
    );
  }
}

export const ScriptedFieldsTable = withHooks(ScriptedFields);
