#!/bin/bash

# Copyright 2022 Symbl.ai contributors. All Rights Reserved.
# SPDX-License-Identifier: MIT

# set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

set +x
echo " " # formatting

API_TYPE="${1:-""}"
EXAMPLE_NAME="${2:-""}"
SDK_LANG="${SDK_LANG:-""}"

if [[ -z "${SDK_LANG}" ]]; then
    SDK_LANG="node"
fi

if [[ -z "${API_TYPE}" && -z "${EXAMPLE_NAME}" ]]; then
    echo "Syntax: <SDK_LANG=lang> run-example.sh [API_TYPE] <PROJECT_NAME> <PARAM=VALUE>"
    echo " "
    echo "Required Parameters:"
    echo "- API_TYPE (required): async, realtime or telephony"
    echo " "
    echo "Optional parameters:"
    echo "- PROJECT_NAME (optional): if missing, will provide a list of projects"
    echo "- SDK_LANG (optional): environment variable to select the language"
    echo "- <PARAM=VALUE> (optional): some action require user input"
    echo " "
    echo "Examples:"
    echo "To list examples for streaming projects, run:"
    echo "run-example.sh realitime"
    echo " "
    echo "To the realtime tracker example, run:"
    echo "run-example.sh realitime tracker"
    echo " "
    exit 1
fi

FILENAME="${FILENAME:-""}"
URI="${URI:-""}"
TRACKER_ID="${TRACKER_ID:-""}"
TRACKER_NAME="${TRACKER_NAME:-""}"
TRACKER_VALUE="${TRACKER_VALUE:-""}"

# handle params
i=3;
j=$#;
while [ $i -le $j ] 
do
    key=$(echo "${3}" | cut -d "=" -f 1)
    value=$(echo "${3}" | cut -d "=" -f 2)

    case "${key}" in
        "FILENAME" | "filename")
            FILENAME="${value}"
            ;;
        "URI" | "uri")
            URI="${value}"
            ;;
        "TRACKER_ID" | "TRACKERId" | "tracker_id" | "trackeid")
            TRACKER_ID="${value}"
            ;;
        "TRACKER_NAME" | "TRACKERNAME" | "tracker_name" | "trackename")
            TRACKER_NAME="${value}"
            ;;
        "TRACKER_VALUE" | "TRACKERVALUE" | "tracker_value" | "trackevalue")
            TRACKER_VALUE="${value}"
            ;;
        *)
            echo "Unknown parameter. Skipping."
            ;;
    esac

    i=$((i + 1));
    shift 1;
done

if [[ "${SDK_LANG}" != "node" ]]; then
    echo "Currently the only language that is supported is nodejs."
    exit 1
fi
if [[ -z "$(command -v ${SDK_LANG})" ]]; then
  echo "Please make sure ${SDK_LANG} is installed."
  exit 1
fi

# checks
case "${API_TYPE}" in
    "async")
        if [[ -z "${FILENAME}" ]]; then
            echo "If you want to provide your own audio file, specify FILENAME=\"PATH_TO_FILE\"."
            echo "Otherwise, the default at the root of the repo will be provided."
            echo " "
        fi
        ;;
    "management")
        if [[ "${EXAMPLE_NAME}" == "create" ]]; then
            if [[ -z "${TRACKER_NAME}" || -z "${TRACKER_VALUE}" ]]; then
                echo "The tracker name and/or value must be set."
                echo "Add TRACKER_NAME=\"myname\" or TRACKER_value=\"myvalue\" if they are missing."
                exit 1
            fi
        elif [[ "${EXAMPLE_NAME}" == "delete" ]]; then
            if [[ -z "${TRACKER_ID}" ]]; then
                echo "To delete a tracker the ID must be set."
                echo "Add TRACKER_ID=\"id\" where id is the value of the Tracker ID."
                exit 1
            fi
        fi
        ;;
    "streaming" | "telephony")
        ;;
    *)
        echo "The only supported API types are management async, realtime or telephony."
        exit 1
        ;;
esac

if [[ -z "${FILENAME}" ]]; then
    FILENAME="newPhonecall.mp3"
fi

if [[ -z "${EXAMPLE_NAME}" ]]; then
    echo "Here is a list of examples using the ${API_TYPE} APIs:"
    find "./examples/node/${API_TYPE}"  -type dir | grep "/${API_TYPE}/" | rev | cut -d '/' -f '1' | rev
    exit 1
fi

DIRECTORY="examples/${SDK_LANG}/${API_TYPE}/${EXAMPLE_NAME}"
if [[ ! -d "${DIRECTORY}" ]]; then
    echo "Invalid project name. Here are the list that are available:"
    find "./examples/node/${API_TYPE}"  -type dir | grep "/${API_TYPE}/" | rev | cut -d '/' -f '1' | rev
    exit 1
fi

# execute the example
FILENAME="${FILENAME}" \
URI="${URI}" \
TRACKER_ID="${TRACKER_ID}" \
TRACKER_NAME="${TRACKER_NAME}" \
TRACKER_VALUE="${TRACKER_VALUE}" \
node "${DIRECTORY}/index.js"

set -x
