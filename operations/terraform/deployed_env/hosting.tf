resource "aws_s3_bucket" "deploy" {
  bucket        = local.domain_name
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

resource "aws_s3_bucket_policy" "deploy_bucket_access_policy" {
  bucket = aws_s3_bucket.deploy.id
  policy = data.aws_iam_policy_document.deploy_bucket_access_policy.json
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

  aliases = concat([local.domain_name], var.additional_cloudfront_aliases)

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
