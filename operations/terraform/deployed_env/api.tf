resource "aws_api_gateway_domain_name" "api" {
  domain_name     = local.api_domain_name
  certificate_arn = aws_acm_certificate.cert.arn
  security_policy = "TLS_1_2"
}

resource "aws_api_gateway_rest_api" "api" {
  name                      = "upci-wall-of-honor-${var.environment}-api"
  api_key_source            = "AUTHORIZER"
  minimum_compression_size  = 16384

  endpoint_configuration {
    types = [ "EDGE" ]
  }
}

resource "aws_api_gateway_authorizer" "user_pool_auth" {
  name          = "upci-wall-of-honor-${var.environment}-api-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [ aws_cognito_user_pool.users.arn ]
}

resource "aws_api_gateway_model" "Minister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "Minister"
  content_type  = "application/json"
  schema        = jsonencode(yamldecode(file("../../../../api/openapi/models/Minister.yaml")))
}

resource "aws_api_gateway_model" "ArrayOfMinister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfMinister"
  content_type  = "application/json"
  schema        = jsonencode({
    type = "array"
    items = {
      "$ref" = "https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/Minister"
    }
  })
}

resource "aws_api_gateway_resource" "ministers" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_rest_api.api.root_resource_id
  path_part     = "ministers"
}

resource "aws_api_gateway_method" "ListMinisters" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ministers.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "CreateMinister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ministers.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.user_pool_auth.id

  request_parameters = {
    "method.request.querystring.state" = false
  }
}

#resource "aws_api_gateway_integration" "FetchMinisters" {
#  rest_api_id   = aws_api_gateway_rest_api.api.id
#  resource_id   = aws_api_gateway_resource.ministers.id
#  http_method   = aws_api_gateway_method.ListMinisters.http_method
#  type          = "AWS"
#  # TODO: pick up here
#  uri           = "arn:aws:apigateway:us-east-2:dynamodb:
#  cache_key_parameters  = ["method.request.querystring.state"]
#}
#
#resource "aws_api_gateway_deployment" "api" {
#  rest_api_id   = aws_api_gateway_rest_api.api.id
#  stage_name    = "live"
#
#  depends_on = [aws_api_gateway_integration.FetchMinisters]
#}
#
#resource "aws_api_gateway_base_path_mapping" "api" {
#  api_id      = aws_api_gateway_rest_api.api.id
#  stage_name  = aws_api_gateway_deployment.api.stage_name
#  domain_name = aws_api_gateway_domain_name.api.domain_name
#  base_path   = "v1"
#}
