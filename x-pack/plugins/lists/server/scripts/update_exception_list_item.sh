#!/bin/bash

#
# Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
# or more contributor license agreements. Licensed under the Elastic License
# 2.0; you may not use this file except in compliance with the Elastic License
# 2.0.
#

set -e
./check_env_variables.sh

# Uses a default if no argument is specified
LISTS=(${@:-./exception_lists/updates/simple_update_item.json})

# Example: ./update_exception_list_item.sh
# Example: ./update_exception_list_item.sh ./exception_lists/updates/simple_update_item.json
for LIST in "${LISTS[@]}"
do {
  [ -e "$LIST" ] || continue
  curl -s -k \
  -H 'Content-Type: application/json' \
  -H 'kbn-xsrf: 123' \
  -u ${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD} \
  -X PUT ${KIBANA_URL}${SPACE_URL}/api/exception_lists/items \
  -d @${LIST} \
  | jq .;
} &
done

wait
