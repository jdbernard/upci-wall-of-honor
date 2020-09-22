resource "aws_acm_certificate" "cert" {
  provider          = aws.cert
  domain_name       = local.domain_name
  validation_method = "DNS"

  subject_alternative_names = concat(
		var.additional_cloudfront_aliases,
		[local.api_domain_name]
  )

  tags = {
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [ each.value.record ]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone.zone_id
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.cert
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_route53_record" "subdomain" {
  count = var.create_env_subdomain ? 1: 0
  zone_id = var.route53_zone.zone_id
  name = local.domain_name
  type = "A"

  alias {
    name    = aws_cloudfront_distribution.cdn.domain_name
    zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.cdn]
}

resource "aws_route53_record" "api_domain" {
  name = local.api_domain_name
  type = "A"
  zone_id = var.route53_zone.zone_id

  alias {
    evaluate_target_health  = true
    name                    = aws_api_gateway_domain_name.api.cloudfront_domain_name
    zone_id                 = aws_api_gateway_domain_name.api.cloudfront_zone_id
  }
}
