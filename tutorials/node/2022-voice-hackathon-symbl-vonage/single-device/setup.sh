#!/bin/bash

# Copyright 2022 Symbl.ai contributors. All Rights Reserved.
# SPDX-License-Identifier: MIT

# set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

set +x

API_KEY="${API_KEY:-""}"
API_SECRET="${API_SECRET:-""}"
APP_ID="${APP_ID:-""}"
APP_SECRET="${APP_SECRET:-""}"

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo " "
echo " "
echo "If you haven't done this already, you want to export the following things before proceeding:"
echo " "
echo "Vonage API secrets:"
echo "-----------------------------"
echo "export API_KEY=AAAAA"
echo "export API_SECRET=BBBBB"
echo " "
echo "Symbl API secrets:"
echo "-----------------------------"
echo "export APP_ID=XXXXX"
echo "export APP_SECRET=YYYYY"
echo " "

if [[ -z "${API_KEY}" ]]; then
    echo " "
    echo "The Vonage API_KEY is not set"
    exit 1
fi
if [[ -z "${API_SECRET}" ]]; then
    echo " "
    echo "The Vonage API_SECRET is not set"
    exit 1
fi
if [[ -z "${APP_ID}" ]]; then
    echo " "
    echo "The Symbl APP_ID is not set"
    exit 1
fi
if [[ -z "${APP_SECRET}" ]]; then
    echo " "
    echo "The Symbl APP_SECRET is not set"
    exit 1
fi

if [[ -z "$(command -v node)" ]]; then
    echo " "
    echo "Please make sure node is installed."
    exit 1
fi

if [[ ! -d "opentok-node" ]]; then
    echo " "
    echo "Cloning the sample repo...."
    git clone https://github.com/dvonthenen/opentok-node.git
else
    echo " "
    echo "The sample repo already exists. Skipping clone."
fi

cd "${MY_DIR}/opentok-node"
if [[ ! -d "node_modules" ]]; then
    set -x
    echo " "
    echo "Getting node project dependencies!"
    npm install opentok --save
    npm install
    set +x
fi

cd "${MY_DIR}/opentok-node/sample/Broadcast"
if [[ ! -d "node_modules" ]]; then
    set -x
    echo " "
    echo "Getting node project dependencies!"
    npm install opentok --save
    npm install
    set +x
fi

echo " "
echo "Running sample Vonage-Symbl for use on a single device..."
echo " "

set -x

node index.js
