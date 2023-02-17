#!/bin/bash


SCRIPT_DIR=$( dirname -- "$(readlink -f "$0" )")
export DAS_PKG_DIR="$SCRIPT_DIR"
alias das='node "$DAS_PKG_DIR/cli"'
