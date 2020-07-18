#data "aws_iam_policy_document" "codebuild_trust_relationship" {
#  statement {
#    actions = [
#      "sts:AssumeRole"
#    ]

#    principals {
#      type        = "Service"
#      identifiers = ["codebuild.amazonaws.com"]
#    }
#  }
#}

#data "aws_iam_policy_document" "build_and_deploy" {
#  statement {
#    actions = [
#      "logs:CreateLogStream",
#      "logs:PutLogEvents"
#    ]

#    resources = [
#      aws_cloudwatch_log_group.codebuild.arn
#    ]
#  }

#  statement {
#    actions = [
#      "s3:ListBucket"
#    ]

#    resources = [
#      aws_s3_bucket.project.arn
#    ]
#  }

#  statement {
#    actions = [
#      "s3:PutObject",
#      "s3:GetObject",
#      "s3:DeleteObject"
#    ]

#    resources = [
#      "${aws_s3_bucket.project.arn}/codebuild",
#      "${aws_s3_bucket.project.arn}/codebuild/*"
#    ]
#  }

#  statement {
#    actions = [
#      "cloudfront:CreateInvalidation"
#      "cloudfront:ListDistributions"
#    ]

#    resources = [
#      "*"
#    ]
#  }
#}

#resource "aws_iam_role" "build_and_deploy" {
#  name = "BuildAndDeploy"
#  assume_role_policy = data.aws_iam_policy_document.codebuild_trust_relationship.json
#}


#resource "aws_iam_role_policy" "codebuild_build_and_deploy" {
#  name    = "BuildAndDeployPolicy"
#  role    = aws_iam_role.build_and_deploy.id
#  policy  = data.aws_iam_policy_document.build_and_deploy.json
#}

#resource "aws_cloudwatch_log_group" "codebuild" {
#  name = "CodeBuildLogs"
#}

#resource "aws_cloudwatch_log_stream" "frontend_build" {
#  name            = "FrontendBuild"
#  log_group_name  = aws_cloudwatch_log_group.codebuild.name
#}

#resource "aws_codebuild_project" "frontend" {
#  name          = "upci-wall-of-honor-frontend"
#  description   = "UPCI Wall of Honor frontend CI/CD pipeline."
#  build_timeout = "10"
#  badge_enabled = true
#  service_role  = aws_iam_role.build_and_deploy.arn

#  artifacts {
#    type = "NO_ARTIFACTS"
#  }

#  cache {
#    type      = "S3"
#    location  = "${aws_s3_bucket.project.id}/codebuild/cache"
#  }

#  environment {
#    compute_type                = "BUILD_GENERAL1_SMALL"
#    image                       = "aws/codebuild/standard:4.0"
#    type                        = "LINUX_CONTAINER"
#  }

#  logs_config {
#    cloudwatch_logs {
#      group_name  = aws_cloudwatch_log_group.codebuild.name
#      stream_name = aws_cloudwatch_log_stream.frontend_build.name
#    }

#    s3_logs {
#      status    = "ENABLED"
#      location  = "${aws_s3_bucket.project.id}/codebuild/logs"
#    }
#  }

#  source {
#    type            = "CODECOMMIT"
#    buildspec       = "webapp/codecommit/buildspec.yaml"
#    location        = aws_codecommit_repository.repo.clone_url_http
#    git_clone_depth = 1
#  }
#}
