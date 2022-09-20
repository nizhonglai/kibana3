/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  EuiButtonEmpty,
  EuiDescriptionList,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIconTip,
} from '@elastic/eui';
import { Case, CaseStatuses, CaseType } from '../../../common';
import * as i18n from '../case_view/translations';
import { FormattedRelativePreferenceDate } from '../formatted_date';
import { Actions } from './actions';
import { CaseService } from '../../containers/use_get_case_user_actions';
import { StatusContextMenu } from './status_context_menu';
import { getStatusDate, getStatusTitle } from './helpers';
import { SyncAlertsSwitch } from '../case_settings/sync_alerts_switch';
import { OnUpdateFields } from '../case_view';
import { CasesNavigation } from '../links';

const MyDescriptionList = styled(EuiDescriptionList)`
  ${({ theme }) => css`
    & {
      padding-right: ${theme.eui.euiSizeL};
      border-right: ${theme.eui.euiBorderThin};
      @media only screen and (max-width: ${theme.eui.euiBreakpoints.m}) {
        padding-right: 0;
        border-right: 0;
      }
    }
  `}
`;

interface CaseActionBarProps {
  allCasesNavigation: CasesNavigation;
  caseData: Case;
  currentExternalIncident: CaseService | null;
  userCanCrud: boolean;
  disableAlerting: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onUpdateField: (args: OnUpdateFields) => void;
}
const CaseActionBarComponent: React.FC<CaseActionBarProps> = ({
  allCasesNavigation,
  caseData,
  currentExternalIncident,
  disableAlerting,
  userCanCrud,
  isLoading,
  onRefresh,
  onUpdateField,
}) => {
  const date = useMemo(() => getStatusDate(caseData), [caseData]);
  const title = useMemo(() => getStatusTitle(caseData.status), [caseData.status]);
  const onStatusChanged = useCallback(
    (status: CaseStatuses) =>
      onUpdateField({
        key: 'status',
        value: status,
      }),
    [onUpdateField]
  );

  const onSyncAlertsChanged = useCallback(
    (syncAlerts: boolean) =>
      onUpdateField({
        key: 'settings',
        value: { ...caseData.settings, syncAlerts },
      }),
    [caseData.settings, onUpdateField]
  );

  return (
    <EuiFlexGroup gutterSize="l" justifyContent="flexEnd" data-test-subj="case-action-bar-wrapper">
      <EuiFlexItem grow={false}>
        <MyDescriptionList compressed>
          <EuiFlexGroup responsive={false} justifyContent="spaceBetween">
            {caseData.type !== CaseType.collection && (
              <EuiFlexItem data-test-subj="case-view-status">
                <EuiDescriptionListTitle>{i18n.STATUS}</EuiDescriptionListTitle>
                <EuiDescriptionListDescription>
                  <StatusContextMenu
                    currentStatus={caseData.status}
                    disabled={!userCanCrud || isLoading}
                    onStatusChanged={onStatusChanged}
                  />
                </EuiDescriptionListDescription>
              </EuiFlexItem>
            )}
            <EuiFlexItem>
              <EuiDescriptionListTitle>{title}</EuiDescriptionListTitle>
              <EuiDescriptionListDescription>
                <FormattedRelativePreferenceDate
                  data-test-subj={'case-action-bar-status-date'}
                  value={date}
                />
              </EuiDescriptionListDescription>
            </EuiFlexItem>
          </EuiFlexGroup>
        </MyDescriptionList>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiDescriptionList compressed>
          <EuiFlexGroup
            gutterSize="l"
            alignItems="center"
            responsive={false}
            justifyContent="spaceBetween"
          >
            {userCanCrud && !disableAlerting && (
              <EuiFlexItem grow={false}>
                <EuiDescriptionListTitle>
                  <EuiFlexGroup
                    component="span"
                    alignItems="center"
                    gutterSize="xs"
                    responsive={false}
                  >
                    <EuiFlexItem grow={false}>
                      <span>{i18n.SYNC_ALERTS}</span>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiIconTip content={i18n.SYNC_ALERTS_HELP} />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiDescriptionListTitle>
                <EuiDescriptionListDescription>
                  <SyncAlertsSwitch
                    disabled={isLoading}
                    isSynced={caseData.settings.syncAlerts}
                    onSwitchChange={onSyncAlertsChanged}
                  />
                </EuiDescriptionListDescription>
              </EuiFlexItem>
            )}
            <EuiFlexItem grow={false}>
              <span>
                <EuiButtonEmpty
                  data-test-subj="case-refresh"
                  flush="left"
                  iconType="refresh"
                  onClick={onRefresh}
                >
                  {i18n.CASE_REFRESH}
                </EuiButtonEmpty>
              </span>
            </EuiFlexItem>
            {userCanCrud && (
              <EuiFlexItem grow={false} data-test-subj="case-view-actions">
                <Actions
                  allCasesNavigation={allCasesNavigation}
                  caseData={caseData}
                  currentExternalIncident={currentExternalIncident}
                />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiDescriptionList>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export const CaseActionBar = React.memo(CaseActionBarComponent);
