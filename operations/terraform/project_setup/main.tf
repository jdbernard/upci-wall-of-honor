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

resource "aws_route53_zone" "prod" {
  name    = "upciwallofhonor.org"
  comment = "Zone for the UPCI Wall of Honor production environment."
  force_destroy = true
}

resource "aws_codecommit_repository" "repo" {
  repository_name = "upci-wall-of-honor"
  description = "UPCI Wall of Honor display and administrative application."
  default_branch = "master"
}

output "aws_s3_project_bucket" {
  description = "S3 bucket for project artifacts, logs, and build resources."
  value = aws_s3_bucket.project
}

output "aws_route53_project_zone" {
  description = "Route53 Hosted Zone for this project."
  value = aws_route53_zone.project
}

output "aws_route53_prod_zone" {
  description = "Route53 Hosted Zone for the production environment."
  value = aws_route53_zone.prod
}

#output "aws_iam_role_build_and_deploy" {
#  description = "ARN of the Build and Deploy IAM role."
#  value = aws_iam_role.build_and_deploy
#}
