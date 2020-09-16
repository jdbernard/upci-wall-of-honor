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

resource "aws_dynamodb_table" "admin_edit_lock" {
  name            = "admin-edit-locks.upci-wall-of-honor"
  hash_key        = "LockID"
  read_capacity   = 10
  write_capacity  = 10

  attribute {
    name = "LockID"
    type = "S"
  }
}

resource "aws_codecommit_repository" "repo" {
  repository_name = "upci-wall-of-honor"
  description = "UPCI Wall of Honor display and administrative application."
  default_branch = "master"
}

resource "aws_s3_bucket" "project" {
  bucket = "upci-wall-of-honor"
  acl = "log-delivery-write"
}

resource "aws_dynamodb_table" "dynamodb_terraform_state_lock" {
  name          = "terraform-state-lock.upci-wall-of-honor"
  hash_key      = "LockID"
  billing_mode  = "PAY_PER_REQUEST"

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

resource "aws_lambda_function" "verify_jwt" {
  function_name = "verify_jwt"
  filename      = "../../../api/lambda/verify_jwt.zip"
  role          = aws_iam_role.cloudwatch_logger.arn
  runtime       = "nodejs12.x"
  handler       = "index.handler"

  source_code_hash  = filebase64sha256("../../../api/lambda/verify_jwt.zip")
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

output "aws_iam_role_cloudwatch_logger" {
  description = "IAM role for services which need to log to CloudWatch."
  value = aws_iam_role.cloudwatch_logger
}

output "aws_lambda_jwt_verifier" {
  description = "Lambda function that verifies an Okta token."
  value = aws_lambda_function.verify_jwt
}

output "aws_iam_role_jwt_verifier" {
  description = "IAM role that allows principals to invoke to the Lambda-based JWT verifier."
  value = aws_iam_role.invoke_lambda_verifier
}
