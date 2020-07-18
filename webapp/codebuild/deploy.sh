#!/bin/bash
#
# Deploy script for UPCI Wall of Honor Webapp
#
# This script is called during the post_build phase of te CodeBuild project.
# It's job is to inspec the build environment to determine whether this build
# should be deployed to on of the environments and to perfom the deploy if so.

# Exit on all errors. Keep track of the last command and print an error message
# when exiting on errors.
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'if [ $? -ne 0 ]; then echo "\"${last_command}\" command failed with exit code $?."; fi' EXIT

target_env=""

cat << BANNER
Deploy script for UPCI Wall of Honor webapp
-------------------------------------------

Inspecting the build environment for deploy target:
  CODEBUILD_WEBHOOK_EVENT = ${CODEBUILD_WEBHOOK_EVENT}
  CODEBUILD_WEBHOOK_BASE_REF = ${CODEBUILD_WEBHOOK_BASE_REF}
  UPCI_WOH_TARGET_ENV = ${UPCI_WOH_TARGET_ENV}
BANNER

# There are 3 scenarios:
#
# 1. Code is pushed to either the develop or master branches. In this case,
#    CodeBuild is triggered by a webhoo. We need to inspect the base ref to
#    find the target environment.
if [[ -n $CODEBUILD_WEBHOOK_EVENT && -n $CODEBUILD_WEBHOOK_BASE_REF ]]; then

  if [[ $CODEBUILD_WEBHOOK_BASE_REF == *'develop' ]]; then
    target_env="dev"
  elif [[ $CODEBUILD_WEBHOOK_BASE_REF == *'master' ]]; then
    target_env="prod"
  else
    echo "Code was pushed to $CODE_WEBHOOK_BASE_REF, no deployment."
    exit 0
  fi

elif [[ -z $CODEBUILD_WEBHOOK_EVENT && -n $UPCI_WOH_TARGET_ENV ]]; then
  target_env="$UPCI_WOH_TARGET_ENV"

  # All builds should fit on of the above categories.
else
  >&2 cat << ERRMSG
Unrecognized deploy invocation. This script expects either the
CODEBUILD_WEBHOOK_EVENT or UPCI_WOH_TARGET_ENV environment variable to be set.
ERRMSG

  exit 1
fi

# Now we can perform the actual deploy.
target_domain="${target_env}.upci-woh.jdb-labs.com"
if [[ $target_env == "prod" ]]; then target_domain="www.upciwallofhonor.org"; fi
echo "Deploy target is ${target_env}. Deploying to ${target_domain}."
aws s3 sync ./dist/ "s3://${target_domain}"
aws s3 cp ./dist/index.html "s3://${target_domain}/index.html" \
  --metadata "Cache-Control=no-store"

# The following uses the --query feature of the AWS CLI to directly extract the
# ID of the CloudFront distribution we're targetting. The value is a JMESPath
# expression which allows us to query the JSON response object. You can run
#
#     aws cloudfront list-distributions
#
# to get an example of the full object model we're querying. The query breaks
# down into:
#
#     # Select the distribution objects
#     DistributionList.Items
#
#     # Look for the distribution whose's domain name for the first origin
#     # configuration (there's only one in our environments) matches the
#     # environment we're targeting.
#     [?starts_with(Origins.Items[0].DomainName, '${target_domain}')]
#
#     # From the matching records, extract the Id only.
#     .Id
#
#     # We get an array but we know there will only be one matching Id, so
#     # let's extract that from the array
#     | [0]
#
#     # Finally, the ID we get out of this query includes quote marks (it's a
#     # JSON string). We need to remove those before passing this into the next
#     # command. Pipe through sed to use regex's to chomp
#     | sed -e 's/^"//' -e 's/"$//'
#
# For details about the --query option see the following:
# - http://jmespath.org/
# - https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-output.html#cli-usage-output-filter

echo "Looking up the CloudFront Distribution ID for ${target_domain}."
cloudfront_distribution_id=$(\
  aws cloudfront list-distributions \
    --query "DistributionList.Items[?starts_with(Origins.Items[0].DomainName, '${target_domain}')].Id | [0]" \
  | sed -e 's/^"//' -e 's/"$//'
)

if [[ -z "${cloudfront_distribution_id}" ]]; then
  >&2 echo "Unable to find CloudFront distribution for domain ${target_domain}."
  exit 3
fi

echo "Found distribution ID ${cloudfront_distribution_id}."

echo "Invalidating the CloudFront cache for ${target_env}."
invalidation_id=$(aws cloudfront create-invalidation \
  --query 'Invalidation.Id' \
  --distribution-id "${cloudfront_distribution_id}" \
  --paths \
    '/index.html' \
    '/deceased-ministers/index.html' \
    '/order-of-the-faith/index.html' \
    '/executive-leadership/index.html')

if [[ $? -ne 0 || -z "${invalidation_id}" ]]; then
  >&2 echo "Unable to create the CloudFront invalidation."
else
  echo "Successfully created invalidation ${invalidation_id}."
fi

echo "Done."
