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

    error = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/ErrorResponse.yaml"),
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
    create_minister   = file("../../../../api/apigateway/response-templates/CreateMinister.json.vtl")
    list_ministers    = file("../../../../api/apigateway/response-templates/ListMinisters.json.vtl")
    error             = file("../../../../api/apigateway/response-templates/ErrorResponse.json.vtl")
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

  binary_media_types = [
    "image/gif", "image/jpeg", "image/png", "image/webp"
  ]

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
  authorizer_result_ttl_in_seconds = 600
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

resource "aws_api_gateway_model" "Error" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "CustomError"
  content_type  = "application/json"
  schema        = local.models.error
}

resource "aws_api_gateway_resource" "ministers" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_rest_api.api.root_resource_id
  path_part     = "ministers"
}

resource "aws_api_gateway_method" "MinistersOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ministers.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "MinistersOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.MinistersOptions.http_method
  type                    = "MOCK"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "MinistersOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ministers.id
  http_method = aws_api_gateway_method.MinistersOptions.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
    "method.response.header.Access-Control-Allow-Headers" = false
    "method.response.header.Access-Control-Allow-Methods" = false
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "MinistersOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ministers.id
  http_method = aws_api_gateway_method.MinistersOptions.http_method
  status_code = 200

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
  }

  depends_on = [
    aws_api_gateway_integration.MinistersOptions,
    aws_api_gateway_method_response.MinistersOptions
  ]
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

resource "aws_api_gateway_method_response" "CreateMinister_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ministers.id
  http_method = aws_api_gateway_method.CreateMinister.http_method
  status_code = 201

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "CreateMinister" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.CreateMinister.http_method
  status_code             = 201
  selection_pattern       = "2.."

  response_templates = {
    "application/json" = local.response_templates.create_minister
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.CreateMinister,
    aws_api_gateway_method_response.CreateMinister_201
  ]
}

#resource "aws_api_gateway_integration_response" "CreateMinister_400" {
#  rest_api_id             = aws_api_gateway_rest_api.api.id
#  resource_id             = aws_api_gateway_resource.ministers.id
#  http_method             = aws_api_gateway_method.CreateMinister.http_method
#  status_code             = 400
#  selection_pattern       = "400"
#
#  response_parameters = {
#    "method.response.header.Access-Control-Allow-Origin" = "'*'"
#  }
#
#  depends_on = [ aws_api_gateway_integration.CreateMinister ]
#}

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

resource "aws_api_gateway_integration_response" "ListMinisters" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ministers.id
  http_method             = aws_api_gateway_method.ListMinisters.http_method
  status_code             = 200
  selection_pattern       = "2.."

  response_templates = {
    "application/json" = local.response_templates.list_ministers
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.ListMinisters,
    aws_api_gateway_method_response.ListMinisters_200
  ]
}

resource "aws_api_gateway_resource" "photo" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.ministers.id
  path_part   = "photo"
}

resource "aws_api_gateway_resource" "photo_upload" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.photo.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "UploadOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.photo_upload.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "UploadOptions" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.photo_upload.id
  http_method           = aws_api_gateway_method.UploadOptions.http_method
  type                  = "MOCK"
  cache_key_parameters  = []
  request_parameters    = {}
  passthrough_behavior  = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "UploadOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.UploadOptions.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
    "method.response.header.Access-Control-Allow-Headers" = false
    "method.response.header.Access-Control-Allow-Methods" = false
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "UploadOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.UploadOptions.http_method
  status_code = 200

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
  }

  depends_on = [
    aws_api_gateway_integration.UploadOptions,
    aws_api_gateway_method_response.UploadOptions,
  ]
}

resource "aws_api_gateway_method" "UploadMinisterPhoto" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.photo_upload.id
  http_method           = "POST"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id

  request_parameters = {
    "method.request.path.id"              = true
    "method.request.header.Content-Type"  = true
  }
}

resource "aws_api_gateway_integration" "UploadMinisterPhoto" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.photo_upload.id
  http_method             = aws_api_gateway_method.UploadMinisterPhoto.http_method
  credentials             = aws_iam_role.minister_photo_upload.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:s3:path/${aws_s3_bucket.deploy.id}/img/minister-photos/{object}"
  integration_http_method = "PUT"
  cache_key_parameters    = []
  request_templates       = {}
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters      = {
    "integration.request.path.object" = "method.request.path.id"
    "integration.request.header.Content-Type" = "method.request.header.Content-Type"
  }
}

resource "aws_api_gateway_method_response" "UploadMinisterPhoto_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.UploadMinisterPhoto.http_method
  status_code = 201

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "UploadMinisterPhoto_201" {
  rest_api_id       = aws_api_gateway_rest_api.api.id
  resource_id       = aws_api_gateway_resource.photo_upload.id
  http_method       = aws_api_gateway_method.UploadMinisterPhoto.http_method
  status_code       = 201
  selection_pattern = "20[01]"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.UploadMinisterPhoto,
    aws_api_gateway_method_response.UploadMinisterPhoto_201
  ]
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
      local.models.error,
      local.request_templates.create_minister,
      local.request_templates.list_ministers,
      local.response_templates.create_minister,
      local.response_templates.list_ministers,
      ""
    ]))
  }

  depends_on = [
    aws_api_gateway_integration.CreateMinister,
    aws_api_gateway_integration.ListMinisters
  ]
}

resource "aws_api_gateway_method_settings" "general_settings" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = aws_api_gateway_deployment.api.stage_name
  method_path   = "*/*"

  settings {
    metrics_enabled     = true
    data_trace_enabled  = true
    logging_level       = "INFO"

    throttling_rate_limit   = 100
    throttling_burst_limit  = 500
  }

  depends_on = [
    aws_api_gateway_deployment.api,
    aws_api_gateway_stage.live
  ]
}

resource "aws_api_gateway_base_path_mapping" "api" {
  api_id      = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_deployment.api.stage_name
  domain_name = aws_api_gateway_domain_name.api.domain_name
  base_path   = "v1"
}
