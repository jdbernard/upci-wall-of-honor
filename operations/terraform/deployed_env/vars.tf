provider "aws" {
  alias = "cert"
  region = "us-east-1"
}

variable "environment" {
  description = "The short name of the environment this deployment represents. For example: 'dev', 'demo', 'prod'. This short name will be used when naming resources (S3 buckets, etc.)."
}

variable "project_bucket_id" {
  description = "Bucket ID of the primary project state storage bucket. Used to collect logs, etc."
}

variable "route53_zone" {
  description = "Route53 hosted zone for the deployed environments."
}

variable "create_env_subdomain" {
  description = "Should an environment-specific subdomain be created for this module? For example, dev.upci-woh.com"
  default = true
  type = bool
}

variable "additional_cloudfront_aliases" {
  description = "Additional domains on which CloudFront should serve content."
  default = []
  type = list(string)
}

variable "verify_jwt_lambda" {
  description = "Lambda for use in verifying the authorization of API requests."
}

variable "jwt_verifier_role" {
  description = "IAM role which grants invoke permission on the JWT verifier Lambda function."
}

variable "cloudwatch_logger_role" {
  description = "IAM role which grants permission to create CloudWatch log groups and entries."
}

locals {
  domain_name       = "${var.environment}.${trimsuffix(var.route53_zone.name, ".")}"
  api_domain_name   = var.create_env_subdomain ? "api.${var.environment}.${trimsuffix(var.route53_zone.name, ".")}" : "api.${trimsuffix(var.route53_zone.name, ".")}"
}

output "aws_cloudfront_distribution" {
  description = "CloudFront CDN for the application."
  value = aws_cloudfront_distribution.cdn
}
