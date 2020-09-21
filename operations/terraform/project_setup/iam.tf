## -- API Assume Role

data "aws_iam_policy_document" "api_can_assume_role" {
  statement {
    actions = [ "sts:AssumeRole" ]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = [ "apigateway.amazonaws.com", "lambda.amazonaws.com" ]
    }
  }
}

## - Lambda Verifier & Invokation Roles & Policy

resource "aws_iam_role" "cloudwatch_logger" {
  name                = "cloudwatch_logger"
  assume_role_policy  = data.aws_iam_policy_document.api_can_assume_role.json
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logger" {
  role        = aws_iam_role.cloudwatch_logger.name
  policy_arn  = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}

data "aws_iam_policy_document" "invoke_lambda_verifier" {
  statement {
    actions   = [ "lambda:InvokeFunction" ]
    effect    = "Allow"
    resources = [ aws_lambda_function.verify_jwt.arn ]
  }
}

resource "aws_iam_policy" "invoke_lambda_verifier" {
  name    = "call_lambda_verify_jwt"
  policy  = data.aws_iam_policy_document.invoke_lambda_verifier.json
}

resource "aws_iam_role" "invoke_lambda_verifier" {
  name                = "call_lambda_verify_jwt"
  assume_role_policy  = data.aws_iam_policy_document.api_can_assume_role.json
}

resource "aws_iam_role_policy_attachment" "invoke_lambda_verifier" {
  role        = aws_iam_role.invoke_lambda_verifier.name
  policy_arn  = aws_iam_policy.invoke_lambda_verifier.arn
}
