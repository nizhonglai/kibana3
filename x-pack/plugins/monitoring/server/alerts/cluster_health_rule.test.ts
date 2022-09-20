/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ClusterHealthRule } from './cluster_health_rule';
import { RULE_CLUSTER_HEALTH } from '../../common/constants';
import { AlertClusterHealthType, AlertSeverity } from '../../common/enums';
import { fetchClusterHealth } from '../lib/alerts/fetch_cluster_health';
import { fetchClusters } from '../lib/alerts/fetch_clusters';
import { elasticsearchServiceMock } from 'src/core/server/mocks';

const RealDate = Date;

jest.mock('../static_globals', () => ({
  Globals: {
    app: {
      getLogger: () => ({ debug: jest.fn() }),
      config: {
        ui: {
          ccs: { enabled: true },
          metricbeat: { index: 'metricbeat-*' },
        },
      },
    },
  },
}));

jest.mock('../lib/alerts/fetch_cluster_health', () => ({
  fetchClusterHealth: jest.fn(),
}));
jest.mock('../lib/alerts/fetch_clusters', () => ({
  fetchClusters: jest.fn(),
}));

describe('ClusterHealthRule', () => {
  it('should have defaults', () => {
    const rule = new ClusterHealthRule();
    expect(rule.ruleOptions.id).toBe(RULE_CLUSTER_HEALTH);
    expect(rule.ruleOptions.name).toBe('Cluster health');
    expect(rule.ruleOptions.throttle).toBe('1d');
    expect(rule.ruleOptions.actionVariables).toStrictEqual([
      { name: 'clusterHealth', description: 'The health of the cluster.' },
      {
        name: 'internalShortMessage',
        description: 'The short internal message generated by Elastic.',
      },
      {
        name: 'internalFullMessage',
        description: 'The full internal message generated by Elastic.',
      },
      { name: 'state', description: 'The current state of the alert.' },
      { name: 'clusterName', description: 'The cluster to which the node(s) belongs.' },
      { name: 'action', description: 'The recommended action for this alert.' },
      {
        name: 'actionPlain',
        description: 'The recommended action for this alert, without any markdown.',
      },
    ]);
  });

  describe('execute', () => {
    function FakeDate() {}
    FakeDate.prototype.valueOf = () => 1;

    const ccs = undefined;
    const clusterUuid = 'abc123';
    const clusterName = 'testCluster';
    const healths = [
      {
        health: AlertClusterHealthType.Yellow,
        clusterUuid,
        ccs,
      },
    ];

    const replaceState = jest.fn();
    const scheduleActions = jest.fn();
    const getState = jest.fn();
    const executorOptions = {
      services: {
        scopedClusterClient: elasticsearchServiceMock.createScopedClusterClient(),
        alertInstanceFactory: jest.fn().mockImplementation(() => {
          return {
            replaceState,
            scheduleActions,
            getState,
          };
        }),
      },
      state: {},
    };

    beforeEach(() => {
      // @ts-ignore
      Date = FakeDate;
      (fetchClusterHealth as jest.Mock).mockImplementation(() => {
        return healths;
      });
      (fetchClusters as jest.Mock).mockImplementation(() => {
        return [{ clusterUuid, clusterName }];
      });
    });

    afterEach(() => {
      Date = RealDate;
      replaceState.mockReset();
      scheduleActions.mockReset();
      getState.mockReset();
    });

    it('should fire actions', async () => {
      const rule = new ClusterHealthRule();
      const type = rule.getRuleType();
      await type.executor({
        ...executorOptions,
        params: {},
      } as any);
      expect(replaceState).toHaveBeenCalledWith({
        alertStates: [
          {
            cluster: { clusterUuid: 'abc123', clusterName: 'testCluster' },
            ccs,
            itemLabel: undefined,
            nodeId: undefined,
            nodeName: undefined,
            meta: {
              ccs,
              clusterUuid,
              health: AlertClusterHealthType.Yellow,
            },
            ui: {
              isFiring: true,
              message: {
                text: 'Elasticsearch cluster health is yellow.',
                nextSteps: [
                  {
                    text: 'Allocate missing replica shards. #start_linkView now#end_link',
                    tokens: [
                      {
                        startToken: '#start_link',
                        endToken: '#end_link',
                        type: 'link',
                        url: 'elasticsearch/indices',
                      },
                    ],
                  },
                ],
              },
              severity: AlertSeverity.Warning,
              triggeredMS: 1,
              lastCheckedMS: 0,
            },
          },
        ],
      });
      expect(scheduleActions).toHaveBeenCalledWith('default', {
        action: '[Allocate missing replica shards.](elasticsearch/indices)',
        actionPlain: 'Allocate missing replica shards.',
        internalFullMessage:
          'Cluster health alert is firing for testCluster. Current health is yellow. [Allocate missing replica shards.](elasticsearch/indices)',
        internalShortMessage:
          'Cluster health alert is firing for testCluster. Current health is yellow. Allocate missing replica shards.',
        clusterName,
        clusterHealth: 'yellow',
        state: 'firing',
      });
    });

    it('should not fire actions if the cluster health is green', async () => {
      (fetchClusterHealth as jest.Mock).mockImplementation(() => {
        return [
          {
            health: AlertClusterHealthType.Green,
            clusterUuid,
            ccs,
          },
        ];
      });
      const rule = new ClusterHealthRule();
      const type = rule.getRuleType();
      await type.executor({
        ...executorOptions,
        params: {},
      } as any);
      expect(replaceState).not.toHaveBeenCalledWith({});
      expect(scheduleActions).not.toHaveBeenCalled();
    });
  });
});
