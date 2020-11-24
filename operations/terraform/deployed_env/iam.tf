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
    actions   = [ "dynamodb:PutItem", "dynamodb:DeleteItem" ]
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

## -- S3 Bucket Access (image upload)

data "aws_iam_policy_document" "minister_photo_upload" {
  statement {
    actions   = [ "s3:PutObject" ]
    effect    = "Allow"
    resources = [ "${aws_s3_bucket.deploy.arn}/img/minister-photos/*" ]
  }
}

resource "aws_iam_policy" "minister_photo_upload" {
  name    = "${local.domain_name}_minister_photo_upload"
  policy  = data.aws_iam_policy_document.minister_photo_upload.json
}

resource "aws_iam_role" "minister_photo_upload" {
  name                = "${local.domain_name}_minister_photo_upload"
  assume_role_policy  = data.aws_iam_policy_document.api_can_assume_role.json
}

resource "aws_iam_role_policy_attachment" "minister_photo_upload" {
  role        = aws_iam_role.minister_photo_upload.name
  policy_arn  = aws_iam_policy.minister_photo_upload.arn
}
