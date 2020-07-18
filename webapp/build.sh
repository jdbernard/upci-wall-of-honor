#!/bin/bash
#
# Build script for the UPCI's Wall of Honor project.
#
# This script is called during the build phase of the CodeBuild project. It is
# responsible for correctly invoking the Vue CLI Service to build the project
# for the target environment.
#
# This script expects to be in the /webapp directory when it is run.

# Exit on all errors. Keep track of the last command and print an error message
# when exiting on errors.
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'if [ $? -ne 0 ]; then echo "\"${last_command}\" command failed with exit code $?."; fi' EXIT

cat << BANNER
Build Script for UPCI Wall of Honor webapp
------------------------------------------

Inspecting the build environment for the deploy target:
  UPCI_WOH_TARGET_ENV = ${UPCI_WOH_TARGET_ENV}

BANNER

if [[ -z $UPCI_WOH_TARGET_ENV ]]; then
  >&2 cat << ERRMSG
Unrecognized deploy invocation. This script expects UPCI_WOH_TARGET_ENV
environment variable to be set.
ERRMSG

  exit 1
fi

buildMode="development";
if [[ $UPCI_WOH_TARGET_ENV == "prod" ]]; then
  buildMode="production"
fi

echo "Building for $buildMode mode, deploying to $UPCI_WOH_TARGET_ENV."
npm run test:unit
npx vue-cli-service build --mode "$buildMode"
