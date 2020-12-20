locals {

  models = {
    board_category = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/BoardCategory.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    board_member = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/BoardMember.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    leadership_position = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/LeadershipPosition.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    minister = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/Minister.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    array_of_board_category = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/ArrayOfBoardCategory.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    array_of_board_member = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/ArrayOfBoardMember.yaml"),
      "/\\$ref:\\s*['\"]?\\.\\/(.+)\\.yaml['\"]?/",
      "$$ref: 'https://apigateway.amazonaws.com/restapis/${aws_api_gateway_rest_api.api.id}/models/$1'"
    )))

    array_of_leadership_position = jsonencode(yamldecode(replace(
      file("../../../../api/openapi/models/ArrayOfLeadershipPosition.yaml"),
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
    create_board_category = replace(replace(
      file("../../../../api/apigateway/request-templates/CreateSimpleRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_category"
    )

    create_board_member = replace(replace(
      file("../../../../api/apigateway/request-templates/CreateSimpleRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_member"
    )

    create_leadership_position = replace(replace(
      file("../../../../api/apigateway/request-templates/CreateSimpleRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "leadership_position"
    )

    create_minister = replace(
      file("../../../../api/apigateway/request-templates/CreateMinister.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name
    )

    list_board_categories = replace(replace(
      file("../../../../api/apigateway/request-templates/ListRecords.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_category"
    )

    list_board_members = replace(replace(
      file("../../../../api/apigateway/request-templates/ListRecords.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_member"
    )

    list_leadership_positions = replace(replace(
      file("../../../../api/apigateway/request-templates/ListRecords.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "leadership_position"
    )

    list_ministers = replace(
      file("../../../../api/apigateway/request-templates/ListMinisters.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name
    )

    delete_board_category = replace(replace(
      file("../../../../api/apigateway/request-templates/DeleteRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_category"
    )

    delete_board_member = replace(replace(
      file("../../../../api/apigateway/request-templates/DeleteRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "board_member"
    )

    delete_leadership_position = replace(replace(
      file("../../../../api/apigateway/request-templates/DeleteRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "leadership_position"
    )

    get_leadership_position_record = replace(replace(
      file("../../../../api/apigateway/request-templates/GetRecord.json.vtl"),
      "%TABLE_NAME%", aws_dynamodb_table.database.name),
      "%RECORD_TYPE%", "leadership_position"
    )

  }

  response_templates = {
    create_board_category       = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    create_board_member         = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    create_leadership_position  = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    create_minister             = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    error                       = file("../../../../api/apigateway/response-templates/ErrorResponse.json.vtl")

    list_board_categories = replace(
      file("../../../../api/apigateway/response-templates/ListRecords.json.vtl"),
      "%LIST_NAME%", "boardCategories"
    )

    list_board_members = replace(
      file("../../../../api/apigateway/response-templates/ListRecords.json.vtl"),
      "%LIST_NAME%", "boardMembers"
    )

    list_leadership_positions = replace(
      file("../../../../api/apigateway/response-templates/ListRecords.json.vtl"),
      "%LIST_NAME%", "leadershipPositions"
    )

    list_ministers = replace(
      file("../../../../api/apigateway/response-templates/ListRecords.json.vtl"),
      "%LIST_NAME%", "ministers"
    )

    delete_board_category       = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    delete_board_member         = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    delete_leadership_position  = file("../../../../api/apigateway/response-templates/EmptyResponse.json.vtl")
    get_leadership_position_record = file("../../../../api/apigateway/response-templates/SimpleRecord.json.vtl")
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

resource "aws_api_gateway_model" "BoardCategory" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "BoardCategory"
  content_type  = "application/json"
  schema        = local.models.board_category
}

resource "aws_api_gateway_model" "BoardMember" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "BoardMember"
  content_type  = "application/json"
  schema        = local.models.board_member
}

resource "aws_api_gateway_model" "LeadershipPosition" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "LeadershipPosition"
  content_type  = "application/json"
  schema        = local.models.leadership_position
}

resource "aws_api_gateway_model" "Minister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "Minister"
  content_type  = "application/json"
  schema        = local.models.minister
}

resource "aws_api_gateway_model" "ArrayOfBoardCategory" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfBoardCategory"
  content_type  = "application/json"
  schema        = local.models.array_of_board_category

  depends_on = [ aws_api_gateway_model.BoardCategory ]
}

resource "aws_api_gateway_model" "ArrayOfBoardMember" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfBoardMember"
  content_type  = "application/json"
  schema        = local.models.array_of_board_member

  depends_on = [ aws_api_gateway_model.BoardMember ]
}

resource "aws_api_gateway_model" "ArrayOfLeadershipPosition" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfLeadershipPosition"
  content_type  = "application/json"
  schema        = local.models.array_of_leadership_position

  depends_on = [ aws_api_gateway_model.LeadershipPosition ]
}

resource "aws_api_gateway_model" "ArrayOfMinister" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "ArrayOfMinister"
  content_type  = "application/json"
  schema        = local.models.array_of_minister

  depends_on = [ aws_api_gateway_model.Minister ]
}

resource "aws_api_gateway_model" "Error" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  name          = "CustomError"
  content_type  = "application/json"
  schema        = local.models.error
}

resource "aws_api_gateway_resource" "general_board" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_rest_api.api.root_resource_id
  path_part     = "general-board"
}

resource "aws_api_gateway_resource" "board_categories" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_resource.general_board.id
  path_part     = "categories"
}

resource "aws_api_gateway_method" "BoardCategoriesOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.board_categories.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "BoardCategoriesOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.BoardCategoriesOptions.http_method
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

resource "aws_api_gateway_method_response" "BoardCategoriesOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_categories.id
  http_method = aws_api_gateway_method.BoardCategoriesOptions.http_method
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

resource "aws_api_gateway_integration_response" "BoardCategoriesOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_categories.id
  http_method = aws_api_gateway_method.BoardCategoriesOptions.http_method
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
    aws_api_gateway_integration.BoardCategoriesOptions,
    aws_api_gateway_method_response.BoardCategoriesOptions
  ]
}

resource "aws_api_gateway_method" "CreateBoardCategory" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.board_categories.id
  http_method           = "POST"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_models = {
    "application/json" = aws_api_gateway_model.BoardCategory.name
  }
}

resource "aws_api_gateway_integration" "CreateBoardCategory" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.CreateBoardCategory.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/PutItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.create_board_category
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "CreateBoardCategory_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_categories.id
  http_method = aws_api_gateway_method.CreateBoardCategory.http_method
  status_code = 201

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "CreateBoardCategory" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.CreateBoardCategory.http_method
  status_code             = 201
  selection_pattern       = "20[01]"

  response_templates = {
    "application/json" = local.response_templates.create_board_category
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.CreateBoardCategory,
    aws_api_gateway_method_response.CreateBoardCategory_201
  ]
}

#resource "aws_api_gateway_integration_response" "CreateBoardCategory_400" {
#  rest_api_id             = aws_api_gateway_rest_api.api.id
#  resource_id             = aws_api_gateway_resource.board_categories.id
#  http_method             = aws_api_gateway_method.CreateBoardCategory.http_method
#  status_code             = 400
#  selection_pattern       = "400"
#
#  response_parameters = {
#    "method.response.header.Access-Control-Allow-Origin" = "'*'"
#  }
#
#  depends_on = [ aws_api_gateway_integration.CreateBoardCategory ]
#}

resource "aws_api_gateway_method" "ListBoardCategories" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.board_categories.id
  http_method           = "GET"
  authorization         = "NONE"
  request_validator_id  = aws_api_gateway_request_validator.Parameters.id

  request_parameters = {
    "method.request.querystring.state" = false
    "method.request.querystring.startAfter" = false
  }
}

resource "aws_api_gateway_integration" "ListBoardCategories" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.ListBoardCategories.http_method
  credentials             = aws_iam_role.db_read.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/Query"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.list_board_categories
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "ListBoardCategories_200" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.ListBoardCategories.http_method
  status_code             = 200

  response_models = {
    "application/json" = aws_api_gateway_model.ArrayOfBoardCategory.name
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "ListBoardCategories" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_categories.id
  http_method             = aws_api_gateway_method.ListBoardCategories.http_method
  status_code             = 200
  selection_pattern       = "200"

  response_templates = {
    "application/json" = local.response_templates.list_board_categories
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.ListBoardCategories,
    aws_api_gateway_method_response.ListBoardCategories_200
  ]
}

resource "aws_api_gateway_resource" "board_members" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_resource.general_board.id
  path_part     = "members"
}

resource "aws_api_gateway_method" "BoardMembersOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.board_members.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "BoardMembersOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.BoardMembersOptions.http_method
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

resource "aws_api_gateway_method_response" "BoardMembersOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_members.id
  http_method = aws_api_gateway_method.BoardMembersOptions.http_method
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

resource "aws_api_gateway_integration_response" "BoardMembersOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_members.id
  http_method = aws_api_gateway_method.BoardMembersOptions.http_method
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
    aws_api_gateway_integration.BoardMembersOptions,
    aws_api_gateway_method_response.BoardMembersOptions
  ]
}

resource "aws_api_gateway_method" "CreateBoardMember" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.board_members.id
  http_method           = "POST"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_models = {
    "application/json" = aws_api_gateway_model.BoardMember.name
  }
}

resource "aws_api_gateway_integration" "CreateBoardMember" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.CreateBoardMember.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/PutItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.create_board_member
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "CreateBoardMember_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_members.id
  http_method = aws_api_gateway_method.CreateBoardMember.http_method
  status_code = 201

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "CreateBoardMember" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.CreateBoardMember.http_method
  status_code             = 201
  selection_pattern       = "20[01]"

  response_templates = {
    "application/json" = local.response_templates.create_board_member
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.CreateBoardMember,
    aws_api_gateway_method_response.CreateBoardMember_201
  ]
}

#resource "aws_api_gateway_integration_response" "CreateBoardMember_400" {
#  rest_api_id             = aws_api_gateway_rest_api.api.id
#  resource_id             = aws_api_gateway_resource.board_members.id
#  http_method             = aws_api_gateway_method.CreateBoardMember.http_method
#  status_code             = 400
#  selection_pattern       = "400"
#
#  response_parameters = {
#    "method.response.header.Access-Control-Allow-Origin" = "'*'"
#  }
#
#  depends_on = [ aws_api_gateway_integration.CreateBoardMember ]
#}

resource "aws_api_gateway_method" "ListBoardMembers" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.board_members.id
  http_method           = "GET"
  authorization         = "NONE"
  request_validator_id  = aws_api_gateway_request_validator.Parameters.id

  request_parameters = {
    "method.request.querystring.state" = false
    "method.request.querystring.startAfter" = false
  }
}

resource "aws_api_gateway_integration" "ListBoardMembers" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.ListBoardMembers.http_method
  credentials             = aws_iam_role.db_read.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/Query"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.list_board_members
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "ListBoardMembers_200" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.ListBoardMembers.http_method
  status_code             = 200

  response_models = {
    "application/json" = aws_api_gateway_model.ArrayOfBoardMember.name
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "ListBoardMembers" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_members.id
  http_method             = aws_api_gateway_method.ListBoardMembers.http_method
  status_code             = 200
  selection_pattern       = "200"

  response_templates = {
    "application/json" = local.response_templates.list_board_members
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.ListBoardMembers,
    aws_api_gateway_method_response.ListBoardMembers_200
  ]
}

resource "aws_api_gateway_resource" "board_member_record" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_resource.board_members.id
  path_part     = "{id}"
}

resource "aws_api_gateway_method" "BoardMemberRecordOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.board_member_record.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "BoardMemberRecordOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_member_record.id
  http_method             = aws_api_gateway_method.BoardMemberRecordOptions.http_method
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

resource "aws_api_gateway_method_response" "BoardMemberRecordOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_member_record.id
  http_method = aws_api_gateway_method.BoardMemberRecordOptions.http_method
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

resource "aws_api_gateway_integration_response" "BoardMemberRecordOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_member_record.id
  http_method = aws_api_gateway_method.BoardMemberRecordOptions.http_method
  status_code = 200

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,OPTIONS'"
  }

  depends_on = [
    aws_api_gateway_integration.BoardMemberRecordOptions,
    aws_api_gateway_method_response.BoardMemberRecordOptions
  ]
}


resource "aws_api_gateway_method" "DeleteBoardMemberRecord" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.board_member_record.id
  http_method           = "DELETE"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "DeleteBoardMemberRecord" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.board_member_record.id
  http_method             = aws_api_gateway_method.DeleteBoardMemberRecord.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/DeleteItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = { "integration.request.path.id" = "method.request.path.id" }
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.delete_board_member
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "DeleteBoardMemberRecord_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.board_member_record.id
  http_method = aws_api_gateway_method.DeleteBoardMemberRecord.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "DeleteBoardMemberRecord" {
  rest_api_id       = aws_api_gateway_rest_api.api.id
  resource_id       = aws_api_gateway_resource.board_member_record.id
  http_method       = aws_api_gateway_method.DeleteBoardMemberRecord.http_method
  status_code       = 200
  selection_pattern = 200

  response_templates = {
    "application/json" = local.response_templates.delete_board_member
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.DeleteBoardMemberRecord,
    aws_api_gateway_method_response.DeleteBoardMemberRecord_200
  ]
}


resource "aws_api_gateway_resource" "leadership_positions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_rest_api.api.root_resource_id
  path_part     = "leadership-positions"
}

resource "aws_api_gateway_method" "LeadershipPositionsOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.leadership_positions.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "LeadershipPositionsOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.LeadershipPositionsOptions.http_method
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

resource "aws_api_gateway_method_response" "LeadershipPositionsOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_positions.id
  http_method = aws_api_gateway_method.LeadershipPositionsOptions.http_method
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

resource "aws_api_gateway_integration_response" "LeadershipPositionsOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_positions.id
  http_method = aws_api_gateway_method.LeadershipPositionsOptions.http_method
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
    aws_api_gateway_integration.LeadershipPositionsOptions,
    aws_api_gateway_method_response.LeadershipPositionsOptions
  ]
}

resource "aws_api_gateway_method" "CreateLeadershipPosition" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.leadership_positions.id
  http_method           = "POST"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_models = {
    "application/json" = aws_api_gateway_model.LeadershipPosition.name
  }
}

resource "aws_api_gateway_integration" "CreateLeadershipPosition" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.CreateLeadershipPosition.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/PutItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.create_leadership_position
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "CreateLeadershipPosition_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_positions.id
  http_method = aws_api_gateway_method.CreateLeadershipPosition.http_method
  status_code = 201

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "CreateLeadershipPosition" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.CreateLeadershipPosition.http_method
  status_code             = 201
  selection_pattern       = "20[01]"

  response_templates = {
    "application/json" = local.response_templates.create_leadership_position
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.CreateLeadershipPosition,
    aws_api_gateway_method_response.CreateLeadershipPosition_201
  ]
}

#resource "aws_api_gateway_integration_response" "CreateLeadershipPosition_400" {
#  rest_api_id             = aws_api_gateway_rest_api.api.id
#  resource_id             = aws_api_gateway_resource.leadership_positions.id
#  http_method             = aws_api_gateway_method.CreateLeadershipPosition.http_method
#  status_code             = 400
#  selection_pattern       = "400"
#
#  response_parameters = {
#    "method.response.header.Access-Control-Allow-Origin" = "'*'"
#  }
#
#  depends_on = [ aws_api_gateway_integration.CreateLeadershipPosition ]
#}

resource "aws_api_gateway_method" "ListLeadershipPositions" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.leadership_positions.id
  http_method           = "GET"
  authorization         = "NONE"
  request_validator_id  = aws_api_gateway_request_validator.Parameters.id

  request_parameters = {
    "method.request.querystring.state" = false
    "method.request.querystring.startAfter" = false
  }
}

resource "aws_api_gateway_integration" "ListLeadershipPositions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.ListLeadershipPositions.http_method
  credentials             = aws_iam_role.db_read.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/Query"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = {}
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.list_leadership_positions
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "ListLeadershipPositions_200" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.ListLeadershipPositions.http_method
  status_code             = 200

  response_models = {
    "application/json" = aws_api_gateway_model.ArrayOfLeadershipPosition.name
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "ListLeadershipPositions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_positions.id
  http_method             = aws_api_gateway_method.ListLeadershipPositions.http_method
  status_code             = 200
  selection_pattern       = "200"

  response_templates = {
    "application/json" = local.response_templates.list_leadership_positions
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.ListLeadershipPositions,
    aws_api_gateway_method_response.ListLeadershipPositions_200
  ]
}

resource "aws_api_gateway_resource" "leadership_position_record" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  parent_id     = aws_api_gateway_resource.leadership_positions.id
  path_part     = "{id}"
}

resource "aws_api_gateway_method" "LeadershipPositionRecordOptions" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.leadership_position_record.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "LeadershipPositionRecordOptions" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_position_record.id
  http_method             = aws_api_gateway_method.LeadershipPositionRecordOptions.http_method
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

resource "aws_api_gateway_method_response" "LeadershipPositionRecordOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_position_record.id
  http_method = aws_api_gateway_method.LeadershipPositionRecordOptions.http_method
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

resource "aws_api_gateway_integration_response" "LeadershipPositionRecordOptions" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_position_record.id
  http_method = aws_api_gateway_method.LeadershipPositionRecordOptions.http_method
  status_code = 200

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,DELETE,OPTIONS'"
  }

  depends_on = [
    aws_api_gateway_integration.LeadershipPositionRecordOptions,
    aws_api_gateway_method_response.LeadershipPositionRecordOptions
  ]
}

resource "aws_api_gateway_method" "DeleteLeadershipPositionRecord" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.leadership_position_record.id
  http_method           = "DELETE"
  authorization         = "CUSTOM"
  authorizer_id         = aws_api_gateway_authorizer.lambda_okta_jwt.id
  request_validator_id  = aws_api_gateway_request_validator.Body.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "DeleteLeadershipPositionRecord" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_position_record.id
  http_method             = aws_api_gateway_method.DeleteLeadershipPositionRecord.http_method
  credentials             = aws_iam_role.db_write.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/DeleteItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = { "integration.request.path.id" = "method.request.path.id" }
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.delete_leadership_position
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "DeleteLeadershipPositionRecord_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_position_record.id
  http_method = aws_api_gateway_method.DeleteLeadershipPositionRecord.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "DeleteLeadershipPositionRecord" {
  rest_api_id       = aws_api_gateway_rest_api.api.id
  resource_id       = aws_api_gateway_resource.leadership_position_record.id
  http_method       = aws_api_gateway_method.DeleteLeadershipPositionRecord.http_method
  status_code       = 200
  selection_pattern = 200

  response_templates = {
    "application/json" = local.response_templates.delete_leadership_position
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.DeleteLeadershipPositionRecord,
    aws_api_gateway_method_response.DeleteLeadershipPositionRecord_200
  ]
}

resource "aws_api_gateway_method" "GetLeadershipPositionRecord" {
  rest_api_id           = aws_api_gateway_rest_api.api.id
  resource_id           = aws_api_gateway_resource.leadership_position_record.id
  http_method           = "GET"
  authorization         = "NONE"
  request_validator_id  = aws_api_gateway_request_validator.Parameters.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "GetLeadershipPositionRecord" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.leadership_position_record.id
  http_method             = aws_api_gateway_method.GetLeadershipPositionRecord.http_method
  credentials             = aws_iam_role.db_read.arn
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/GetItem"
  integration_http_method = "POST"
  cache_key_parameters    = []
  request_parameters      = { "integration.request.path.id" = "method.request.path.id" }
  passthrough_behavior    = "NEVER"

  request_templates = {
    "application/json" = local.request_templates.get_leadership_position_record
  }

  depends_on = [aws_dynamodb_table.database]
}

resource "aws_api_gateway_method_response" "GetLeadershipPositionRecord_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_position_record.id
  http_method = aws_api_gateway_method.GetLeadershipPositionRecord.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "GetLeadershipPositionRecord_200" {
  rest_api_id       = aws_api_gateway_rest_api.api.id
  resource_id       = aws_api_gateway_resource.leadership_position_record.id
  http_method       = aws_api_gateway_method.GetLeadershipPositionRecord.http_method
  status_code       = 200
  selection_pattern = 200

  response_templates = {
    "application/json" = local.response_templates.get_leadership_position_record
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.GetLeadershipPositionRecord,
    aws_api_gateway_method_response.GetLeadershipPositionRecord_200
  ]
}

resource "aws_api_gateway_method_response" "GetLeadershipPositionRecord_404" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.leadership_position_record.id
  http_method = aws_api_gateway_method.GetLeadershipPositionRecord.http_method
  status_code = 404

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "GetLeadershipPositionRecord_404" {
  rest_api_id       = aws_api_gateway_rest_api.api.id
  resource_id       = aws_api_gateway_resource.leadership_position_record.id
  http_method       = aws_api_gateway_method.GetLeadershipPositionRecord.http_method
  status_code       = 404
  selection_pattern = 404

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.GetLeadershipPositionRecord,
    aws_api_gateway_method_response.GetLeadershipPositionRecord_404
  ]
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
  selection_pattern       = "20[01]"

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
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/Query"
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
  selection_pattern       = "200"

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
      local.models.board_category,
      local.models.board_member,
      local.models.leadership_position,
      local.request_templates.create_minister,
      local.request_templates.list_ministers,
      local.request_templates.create_board_category,
      local.request_templates.list_board_categories,
      local.request_templates.create_board_member,
      local.request_templates.list_board_members,
      local.request_templates.create_leadership_position,
      local.request_templates.list_leadership_positions,
      local.request_templates.get_leadership_position_record,
      local.response_templates.create_minister,
      local.response_templates.list_ministers,
      local.response_templates.create_board_category,
      local.response_templates.list_board_categories,
      local.response_templates.create_board_member,
      local.response_templates.list_board_members,
      local.response_templates.create_leadership_position,
      local.response_templates.list_leadership_positions,
      "force-1"
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
