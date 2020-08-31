resource "aws_cognito_user_pool" "users" {
  name                      = "upci-wall-of-honor-${var.environment}-users"
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


#resource "aws_cognito_identity_pool" "identities" {
#  identity_pool_name                = "upci_wall_of_honor_${var.environment}_identities"
#  allow_unauthenticated_identities  = false
#}
