/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { get } from 'lodash';
import * as argHelper from '../../lib/resolved_arg';
import { prepend } from '../../lib/modify_path';
import { State } from '../../../types';

export function getArgs(state: State) {
  return get(state, ['transient', 'resolvedArgs']);
}

export function getArg(state: State, path: any[]) {
  return get(state, prepend(path, ['transient', 'resolvedArgs']));
}

export function getValue(state: State, path: any[]) {
  return argHelper.getValue(getArg(state, path));
}

export function getState(state: State, path: any[]) {
  return argHelper.getState(getArg(state, path));
}

export function getError(state: State, path: any[]) {
  return argHelper.getError(getArg(state, path));
}

export function getInFlight(state: State): boolean {
  return get(state, ['transient', 'inFlight'], false);
}
