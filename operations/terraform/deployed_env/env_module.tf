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

resource "aws_s3_bucket" "deploy" {
  bucket        = "${var.environment}.${trimsuffix(var.route53_zone.name, ".")}"
  acl           = "private"
  force_destroy = true

  logging {
    target_bucket = var.project_bucket_id
    target_prefix = "logs/${var.environment}/s3-access"
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "deploy" {
  bucket = aws_s3_bucket.deploy.id

  block_public_acls   = true
  block_public_policy = true
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "OAI for ${var.environment} environment."
}

data "aws_iam_policy_document" "deploy_bucket_access_policy" {
  statement {
    actions   = [ "s3:GetObject" ]
    effect    = "Allow"
    resources = [ "${aws_s3_bucket.deploy.arn}/*" ]

    principals {
      type = "CanonicalUser"
      identifiers = [ aws_cloudfront_origin_access_identity.origin_access_identity.s3_canonical_user_id ]
    }
  }

  statement {
    actions   = [ "s3:ListBucket" ]
    effect    = "Allow"
    resources = [ aws_s3_bucket.deploy.arn ]

    principals {
      type = "CanonicalUser"
      identifiers = [ aws_cloudfront_origin_access_identity.origin_access_identity.s3_canonical_user_id ]
    }
  }
}

resource "aws_s3_bucket_policy" "deploy_bucket_access_policy" {
  bucket = aws_s3_bucket.deploy.id
  policy = data.aws_iam_policy_document.deploy_bucket_access_policy.json
}

resource "aws_acm_certificate" "cert" {
  provider          = aws.cert
  domain_name       = "${var.environment}.${trimsuffix(var.route53_zone.name, ".")}"
  validation_method = "DNS"

  subject_alternative_names = var.additional_cloudfront_aliases

  tags = {
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  count     = length(var.additional_cloudfront_aliases) + 1
  provider  = aws.cert
  name      = aws_acm_certificate.cert.domain_validation_options[count.index].resource_record_name
  type      = aws_acm_certificate.cert.domain_validation_options[count.index].resource_record_type
  zone_id   = var.route53_zone.zone_id
  records   = [ aws_acm_certificate.cert.domain_validation_options[count.index].resource_record_value ]
  ttl       = 60
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.cert
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = tolist("${aws_route53_record.cert_validation.*.fqdn}")
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.deploy.bucket_regional_domain_name
    origin_id = "S3-${aws_s3_bucket.deploy.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "UPCI Wall of Honor ${var.environment} distribution."
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = "${var.project_bucket_id}.s3.amazonaws.com"
    prefix          = "logs/${var.environment}/cloudfront/"
  }

  aliases = concat(["${var.environment}.${trimsuffix(var.route53_zone.name, ".")}"], var.additional_cloudfront_aliases)

  default_cache_behavior {
    allowed_methods   = [ "GET", "HEAD", "OPTIONS" ]
    cached_methods    = [ "GET", "HEAD" ]
    target_origin_id  = "S3-${aws_s3_bucket.deploy.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                 = 0
    default_ttl             = 31536000 # default to a year
    max_ttl                 = 31536000
    compress                = true
    viewer_protocol_policy  = "redirect-to-https"
  }

  custom_error_response {
    error_code          = 404
    response_code       = 200
    response_page_path  = "/index.html"
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = var.environment
  }

  viewer_certificate {
    acm_certificate_arn   = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }

  depends_on = [ aws_acm_certificate_validation.cert ]
}

resource "aws_route53_record" "subdomain" {
  count = var.create_env_subdomain ? 1: 0
  zone_id = var.route53_zone.zone_id
  name = "${var.environment}.${trimsuffix(var.route53_zone.name, ".")}"
  type = "A"

  alias {
    name    = aws_cloudfront_distribution.cdn.domain_name
    zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.cdn]
}

resource "aws_route53_record" "alternate_domains" {
  count   = length(var.additional_cloudfront_aliases)
  zone_id = var.route53_zone.zone_id
  name    = var.additional_cloudfront_aliases[count.index]
  type    = "A"

  alias {
    name    = aws_cloudfront_distribution.cdn.domain_name
    zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.cdn]
}

#resource "aws_cognito_identity_pool" "identities" {
#  identity_pool_name                = "upci-wall-of-honor-${var.environment}-identities"
#  allow_unauthenticated_identities  = false
#}

resource "aws_cognito_user_pool" "users" {
  name                      = "upci-wall-of-honor-${var.environment}-users"
  auto_verified_attributes  = ["email"]
  username_attributes       = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only  = true
  }

  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = "true"
  }

  schema {
    name                = "given name"
    attribute_data_type = "String"
    required            = "true"
  }

  schema {
    name                = "family name"
    attribute_data_type = "String"
    required            = "true"
  }

  schema {
    name                = "admin"
    attribute_data_type = "Boolean"
    required            = "true"
  }
}
