locals {

  models = {
    minister = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/Minister.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    array_of_minister = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/ArrayOfMinister.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))
  }

  request_templates = {
    create_minister = replace(
      file("../../../../api/apigateway/request-templates/CreateMinister.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name
    )

    list_ministers = replace(
      file("../../../../api/apigateway/request-templates/ListMinisters.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name
    )
  }

  response_templates = {
    create_minister  = file("../../../../api/apigateway/response-templates/CreateMinister.json.vtl")
    list_ministers = file("../../../../api/apigateway/response-templates/ListMinisters.json.vtl")
  }
}


resource "aws_api_gateway_domain_name" "api" {
  domain_name     = local.api_domain_name
  certificate_arn = aws_acm_certificate.cert.arn
  security_policy = "TLS_1_2"
}

resource "aws_api_gateway_rest_api" "api" {
  name                      = local.api_domain_name
  api_key_source            = "AUTHORIZER"
  minimum_compression_size  = 16384

  endpoint_configuration {
    types = [ "EDGE" ]
  }
}

resource "aws_api_gateway_authorizer" "user_pool_auth" {
  name          = local.api_domain_name
  rest_api_id   = aws_api_gateway_rest_api.api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [ aws_cognito_user_pool.users.arn ]
}

resource "aws_api_gateway_authorizer" "lambda_okta_jwt" {
  name                    = "okta-${local.api_domain_name}"
  rest_api_id             = aws_api_gateway_rest_api.api.id
  type                    = "TOKEN"
  authorizer_uri          = var.verify_jwt_lambda.invoke_arn
  authorizer_credentials  = var.jwt_verifier_role.arn
}

resource "aws_api_gateway_request_validator" "Parameters" {
  name                        = "Validate Request Params (${local.domain_name})"
  rest_api_id                 = aws_api_gateway_rest_api.api.id
  validate_request_parameters = true
}

resource "aws_api_gateway_request_validator" "Body" {
  name                  = "Validate Body (${local.domain_name})"
  rest_api_id           = aws_api_gateway_rest_api.api.id
  validate_request_body = true
}

resource "aws_api_gateway_model" "Minister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "Minister"
  content_type  = "application/json"
  schema        = local.models.minister
}

resource "aws_api_gateway_model" "ArrayOfMinister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfMinister"
  content_type  = "application/json"
  schema        = local.models.array_of_minister
}

resource "aws_api_gateway_resource" "ministers" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_rest_api.api.root_resource_id
  path_part     = "ministers"
}

resource "aws_api_gateway_method" "Options" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.ministers.id
  http_method           = "OPTIONS"
  authorization         = "NONE"
}

resource "aws_api_gateway_integration" "Options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.Options.http_method
  type                    = "MOCK"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_integration_response" "Options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.Options.http_method
  status_code             = 200

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
  }
}

resource "aws_api_gateway_method_response" "Options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.Options.http_method
  status_code             = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
    "method.response.header.Access-Control-Allow-Headers" = false
    "method.response.header.Access-Control-Allow-Methods" = false
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method" "CreateMinister" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.ministers.id
  http_method           = "POST"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_models = {
    "application/json" = aws_api_gateway_model.Minister.name
  }
}

resource "aws_api_gateway_integration" "CreateMinister" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.CreateMinister.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/PutItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.create_minister
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_integration_response" "CreateMinister" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.CreateMinister.http_method
  status_code             = 200
  selection_pattern       = "2\\d{2}"

  response_templates = {
    "application/json" = local.response_templates.create_minister
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_method_response" "CreateMinister_200" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.CreateMinister.http_method
  status_code             = 200

  # TODO: future
  #response_models = {
  #  "application/json" = aws_api_gateway_model.StatusResponse.name
  #}

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_method" "ListMinisters" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.ministers.id
  http_method           = "GET"
  authorization         = "NONE"
  request_validator_id  = aws_api_gateway_request_validator.Parameters.id

  request_parameters = {
    "method.request.querystring.state" = false
    "method.request.querystring.startAfter" = false
  }
}

resource "aws_api_gateway_integration" "ListMinisters" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.ListMinisters.http_method
  credentials             = aws_iam_role.db_read.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/Scan"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.list_ministers
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_integration_response" "ListMinisters" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.ListMinisters.http_method
  status_code             = 200
  selection_pattern       = "2\\d{2}"

  response_templates = {
    "application/json" = local.response_templates.list_ministers
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_method_response" "ListMinisters_200" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.ListMinisters.http_method
  status_code             = 200

  response_models = {
    "application/json" = aws_api_gateway_model.ArrayOfMinister.name
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_stage" "live" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.api.id
  stage_name    = "live"

  variables = {
    environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_deployment" "api" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "live"

  variables = {
    deployed_hash = sha1(join(",", [
      local.models.minister,
      local.models.array_of_minister,
      local.request_templates.create_minister,
      local.request_templates.list_ministers,
      local.response_templates.create_minister,
      local.response_templates.list_ministers
    ]))
  }

  depends_on = [
    aws_api_gateway_integration.CreateMinister,
    aws_api_gateway_integration.ListMinisters
  ]
}

resource "aws_api_gateway_base_path_mapping" "api" {
  api_id      = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_deployment.api.stage_name
  domain_name = aws_api_gateway_domain_name.api.domain_name
  base_path   = "v1"
}
