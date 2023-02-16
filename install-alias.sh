#!/bin/bash


SCRIPT_DIR=$( dirname -- "$(readlink -f "$0" )")
export DAL_PKG_DIR="$SCRIPT_DIR"
alias dal='node "$DAL_PKG_DIR/cli"'
