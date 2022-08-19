#!/bin/bash

# Copyright 2022 Symbl.ai contributors. All Rights Reserved.
# SPDX-License-Identifier: MIT

# set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

set +x

API_TYPE="${1:-""}"
EXAMPLE_NAME="${2:-""}"
SDK_LANG="${3:-""}"

if [[ -z "${API_TYPE}" && -z "${EXAMPLE_NAME}" ]]; then
    echo "Syntax: run-example.sh [API_TYPE] [PROJECT_NAME] <SDK_LANG>"
    echo "API_TYPE: realtime or telephony"
    echo " "
    echo "To list examples for streaming projects, run: run-example.sh realitime"
    echo "To the realtime tracker example, run: run-example.sh realitime tracker"
    exit 1
fi

if [[ -z "${SDK_LANG}" ]]; then
    echo " "
    echo "Language type missing. Defaulting with nodejs."
    echo " "
    SDK_LANG="node"
fi
if [[ "${SDK_LANG}" != "node" ]]; then
    echo "Currently the only language that is supported is nodejs."
    exit 1
fi
if [[ -z "$(command -v ${SDK_LANG})" ]]; then
  echo "Please make sure ${SDK_LANG} is installed."
  exit 1
fi

if [[ "${API_TYPE}" != "streaming" && "${API_TYPE}" != "telephony" ]]; then
    echo "The only supported API types are realtime or telephony."
    exit 1
fi

if [[ -z "${EXAMPLE_NAME}" ]]; then
    echo "Here is a list of examples using the ${API_TYPE} APIs:"
    find "./examples/nodejs/${API_TYPE}"  -type dir | grep "/${API_TYPE}/" | rev | cut -d '/' -f '1' | rev
    exit 1
fi

DIRECTORY="examples/${SDK_LANG}/${API_TYPE}/${EXAMPLE_NAME}"
if [[ ! -d "${DIRECTORY}" ]]; then
    echo "Invalid project name. Here are the list that are available:"
    find "./examples/nodejs/${API_TYPE}"  -type dir | grep "/${API_TYPE}/" | rev | cut -d '/' -f '1' | rev
    exit 1
fi

set -x

# execute the example
node "${DIRECTORY}/index.js"
