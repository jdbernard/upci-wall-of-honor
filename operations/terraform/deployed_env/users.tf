resource "aws_cognito_user_pool" "users" {
  name                      = local.domain_name
  auto_verified_attributes  = ["email"]
  username_attributes       = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only  = true
  }

  password_policy {
    minimum_length                    = 12
    require_lowercase                 = true
    require_uppercase                 = true
    require_numbers                   = true
    temporary_password_validity_days  = 7
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = "true"

    string_attribute_constraints {
      min_length = 3
      max_length = 2048
    }
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    required            = "true"

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    required            = "true"

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  username_configuration {
    case_sensitive = false
  }
}

resource "aws_cognito_user_pool_domain" "users" {
  domain            = local.auth_domain_name
  certificate_arn   = aws_acm_certificate.cert.arn
  user_pool_id      = aws_cognito_user_pool.users.id
}

resource "aws_cognito_user_pool_client" "users" {
  name          = "UPCI Wall of Honor ${var.environment} Admin"
  user_pool_id  = aws_cognito_user_pool.users.id

  allowed_oauth_flows   = [ "code" ]
  allowed_oauth_scopes  = [ "openid", "profile", "email" ]
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  allowed_oauth_flows_user_pool_client = true

  callback_urls = [ "https://${local.domain_name}/admin/login" ]
  logout_urls   = [ "https://${local.domain_name}/admin/logout" ]
  supported_identity_providers = [ "COGNITO" ]
}

#resource "aws_cognito_identity_pool" "identities" {
#  identity_pool_name                = "upci_wall_of_honor_${var.environment}_identities"
#  allow_unauthenticated_identities  = false
#}
