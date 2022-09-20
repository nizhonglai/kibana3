/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const getDateMathFormat = (timeUnit: string, timeValue: number) => {
  const now = 'now';

  if (timeValue === 0) {
    return now;
  }

  return `${now}+${timeValue}${timeUnit}`;
};
