## -- S3 and CloudFront bucket access policies

data "aws_iam_policy_document" "deploy_bucket_access_policy" {
  statement {
    actions   = [ "s3:GetObject" ]
    effect    = "Allow"
    resources = [ "${aws_s3_bucket.deploy.arn}/*" ]

    principals {
      type = "AWS"
      identifiers = [ aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn ]
    }
  }

  statement {
    actions   = [ "s3:ListBucket" ]
    effect    = "Allow"
    resources = [ aws_s3_bucket.deploy.arn ]

    principals {
      type = "AWS"
      identifiers = [ aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn ]
    }
  }
}

## -- API Assume Role

data "aws_iam_policy_document" "api_can_assume_role" {
  statement {
    actions = [ "sts:AssumeRole" ]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = [ "apigateway.amazonaws.com" ]
    }
  }
}

## -- DB Read Access

data "aws_iam_policy_document" "db_read" {
  statement {
    actions   = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    effect    = "Allow"
    resources = [ aws_dynamodb_table.database.arn ]
  }
}

resource "aws_iam_policy" "db_read" {
  name    = "${local.domain_name}_db_read_access"
  policy  = data.aws_iam_policy_document.db_read.json
}

resource "aws_iam_role" "db_read" {
  name                = "${local.domain_name}_db_read_access"
  assume_role_policy  = data.aws_iam_policy_document.api_can_assume_role.json
}

resource "aws_iam_role_policy_attachment" "db_read" {
  role        = aws_iam_role.db_read.name
  policy_arn  = aws_iam_policy.db_read.arn
}

## -- DB Write Access

data "aws_iam_policy_document" "db_write" {
  statement {
    actions   = [ "dynamodb:PutItem" ]
    effect    = "Allow"
    resources = [ aws_dynamodb_table.database.arn ]
  }
}

resource "aws_iam_policy" "db_write" {
  name    = "${local.domain_name}_db_write_access"
  policy  = data.aws_iam_policy_document.db_write.json
}

resource "aws_iam_role" "db_write" {
  name                = "${local.domain_name}_db_write_access"
  assume_role_policy  = data.aws_iam_policy_document.api_can_assume_role.json
}

resource "aws_iam_role_policy_attachment" "db_write" {
  role        = aws_iam_role.db_write.name
  policy_arn  = aws_iam_policy.db_write.arn
}
