#!/bin/bash
#
# Build script for the UPCI's Wall of Honor project.
#
# This script is called during the build phase of the CodeBuild project. It is
# responsible for correctly invoking the Vue CLI Service to build the project
# for the target environment.

# Exit on all errors. Keep track of the last command and print an error message
# when exiting on errors.
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'if [ $? -ne 0 ]; then echo "\"${last_command}\" command failed with exit code $?."; fi' EXIT

cat << BANNER
Build Script for UPCI Wall of Honor webapp
------------------------------------------

Inspecting the build environment for the deploy target:
  CODEBUILD_WEBHOOK_EVENT = ${CODEBUILD_WEBHOOK_EVENT}
  CODEBUILD_WEBHOOK_BASE_REF = ${CODEBUILD_WEBHOOK_BASE_REF}
  UPCI_WOH_TARGET_ENV = ${UPCI_WOH_TARGET_ENV}

BANNER

# This build script is triggered in X scenarios:
#
# 1. Code is pushed to either the develop or master branches (via PR or direct
#    push). In this case CodeBuild is triggered by a webhook. We need to
#    inspect the base ref to find the target environment.
if [[ -n $CODEBUILD_WEBHOOK_EVENT && -n $CODEBUILD_WEBHOOK_BASE_REF ]]; then

  # If we have pushed to develop, kick off an automatic deployment to the dev
  # environment.
  if [[ $CODEBUILD_WEBHOOK_BASE_REF == *'develop' ]]; then
    echo "develop branch updated, build targeting DEV"
    npm run build-dev

  elif [[ $CODEBUILD_WEBHOOK_BASE_REF == *'master' ]]; then
    echo "master branch updated, build targeting PROD"
    npm run build

  else
    echo "$CODEBUILD_WEBHOOK_BASE_REF updated, no build target"
    exit 0
  fi

# 2. A build has been manually triggered.
elif [[ -n $UPCI_WOH_TARGET_ENV ]]; then

  buildMode="development";
  [[ $UPCI_WOH_TARGET_ENV == "prod" ]] && buildMode="production"
  echo "Building for $buildMode mode, deploying to $UPCI_WOH_TARGET_ENV."
  npm run test:unit
  npx vue-cli-service build --mode "$buildMode"

else

  >&2 cat << ERRMSG
Unrecognized build invocation. This script expects either the
CODEBUILD_WEBHOOK_EVENT or UPCI_WOH_TARGET_ENV environment variable to be set.
ERRMSG

  exit 1
fi
