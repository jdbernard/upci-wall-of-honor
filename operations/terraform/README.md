# UPCI Wall of Honor Infrastructure

Infrastructure is defined as code.

## Initial Project Setup (one-time)

The `project_setup` directory contains the infrastructure definitions for the
project-wide setup. The following steps were taken when the project was
initially setup:

```sh
# Initialize terraform
$ cd operations/terraform/project_setup
$ terraform init

# Comment our the 'terraform' block in main.tf and then create the initial
# project infrastructure.
$ terraform apply

# Uncomment the 'terraform' block in main.tf and re-init to move the state
# storage into the newly created project bucket and use the new state lock
# table in DynamoDB
$ terraform init
```

After this point the foundational project infrastructure exists in AWS:

* The main S3 bucket used for build artifacts, logs, Terraform state, and other
  similar internal project state: `s3://upci-wall-of-honor`
* The DynamoDB table used by Terraform to prevent concurrent modification of
  the environment state: `terraform-state-lock.upci-wall-of-honor`
* The Route53 hosted zone for the application's environment-specific subdomains.
* The CodeCommit repo for the project.
* The CodeBuild CI/CD pipeline for the project.
* The `BuildAndDeploy` IAM role used by CodeBuild

## Setting Up a New Environment

The `environments` directory contains the configurations for the individual
environments. They all leverage the `deployed_env` common module and pull in
date from the `project_setup` module.

A new environment will need a new set of configuration files. Typically the
configuration from an existing environment is copied into a new directory and
appropriate values are modified. Be careful not to copy over the `.terraform`
folder from the prior environment. The following steps assume the new
environment configuration files have already been created.

To setup a new environment (`dev` in this example):

```sh
# Initialize terraform for this environment
$ cd operations/terraform/environments/dev
$ terraform init

# Create the environment
$ terraform apply
```
