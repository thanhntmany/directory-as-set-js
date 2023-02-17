#!/bin/bash

set -e

DAS_GIT_REPO_RAW="https://raw.githubusercontent.com/thanhntmany/directory-as-set-js/main/"
TEMPDIR=$(mktemp -d -t directory-as-set.js.XXXXXX)

curl "$DAS_GIT_REPO_RAW\das.js" --output das.js
curl "$DAS_GIT_REPO_RAW\install-alias.sh" --output install-alias.sh
source ./install-alias.sh
