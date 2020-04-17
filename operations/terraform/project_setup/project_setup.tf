variable "app_domain" {
  description = "Name of the S3 bucket to store deployed artifacts, logs, etc."
  default = "upci-woh.jdb-labs.com"
}

provider "aws" {
  region = "us-east-2"
}

terraform {
  backend "s3" {
    bucket = "upci-wall-of-honor"
    region = "us-east-2"
    key    = "terraform/project_setup.tfstate"
    dynamodb_table = "terraform-state-lock.upci-wall-of-honor"
  }
}

resource "aws_s3_bucket" "project" {
  bucket = "upci-wall-of-honor"
  acl = "log-delivery-write"
}

resource "aws_dynamodb_table" "dynamodb_terraform_state_lock" {
  name = "terraform-state-lock.upci-wall-of-honor"
  hash_key = "LockID"
  read_capacity = 20
  write_capacity = 20

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "Terraform DynamoDB State Lock Table"
  }
}

resource "aws_route53_zone" "project" {
  name    = var.app_domain
  comment = "Zone for all UPCI Wall of Honor environment sub-domains."
  force_destroy = true
}

#resource "aws_iam_policy_document" "build_and_deploy_policy" {
#  # TODO
#  statement {
#  }
#}

resource "aws_codecommit_repository" "repo" {
  repository_name = "upci-wall-of-honor"
  description = "UPCI Wall of Honor display and administrative application."
  default_branch = "master"
}

#resource "aws_iam_role" "build_and_deploy" {
#  name = "BuildAndDeploy"
#  assume_role_policy = data.aws_iam_policy_document.build_and_deploy_policy.json
#}

#resource "aws_codebuild_project" "project" {
#  name          = "upci-wall-of-honor-frontend"
#  description   = "UPCI Wall of Honor frontend CI/CD pipeline."
#  build_timeout = "10"
#  badge_enabled = true
#}

output "aws_s3_project_bucket" {
  description = "S3 logging bucket resource."
  value = aws_s3_bucket.project
}

output "aws_route53_project_zone" {
  description = "Route53 Hosted Zone for this project."
  value = aws_route53_zone.project
}

#output "aws_iam_role_build_and_deploy" {
#  description = "ARN of the Build and Deploy IAM role."
#  value = aws_iam_role.build_and_deploy
#}
