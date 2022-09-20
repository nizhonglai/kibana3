/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { DetectionEngineUserUnauthenticated } from './detection_engine_user_unauthenticated';
jest.mock('../../../common/lib/kibana');

describe('DetectionEngineUserUnauthenticated', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DetectionEngineUserUnauthenticated />);

    expect(wrapper.find('EmptyPage')).toHaveLength(1);
  });
});
