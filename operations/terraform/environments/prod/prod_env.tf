provider "aws" {
  region = "us-east-2"
}

terraform {
  backend "s3" {
    encrypt = true
    bucket  = "upci-wall-of-honor"
    region  = "us-east-2"
    key     = "terraform/prod.tfstate"
    dynamodb_table = "terraform-state-lock.upci-wall-of-honor"
  }
}

data "terraform_remote_state" "global" {
  backend = "s3"

  config = {
    bucket = "upci-wall-of-honor"
    region = "us-east-2"
    key    = "terraform/project_setup.tfstate"
    dynamodb_table = "terraform-state-lock.upci-wall-of-honor"
  }
}

module "prod_env" {
  source = "../../deployed_env"

  environment = "www"
  additional_cloudfront_aliases = ["upciwallofhonor.org", "oof.upci.org"]
  create_env_subdomain = false

  # Resources defined in the global project setup
  project_bucket_id = data.terraform_remote_state.global.outputs.aws_s3_project_bucket.id
  route53_zone = data.terraform_remote_state.global.outputs.aws_route53_prod_zone
  verify_jwt_lambda = data.terraform_remote_state.global.outputs.aws_lambda_jwt_verifier
  jwt_verifier_role = data.terraform_remote_state.global.outputs.aws_iam_role_jwt_verifier
  cloudwatch_logger_role = data.terraform_remote_state.global.outputs.aws_iam_role_cloudwatch_logger
}

resource "aws_route53_record" "prod_www_subdomain" {
  zone_id = data.terraform_remote_state.global.outputs.aws_route53_prod_zone.zone_id
  name = "www.upciwallofhonor.org"
  type = "A"

  alias {
    name    = module.prod_env.aws_cloudfront_distribution.domain_name
    zone_id = module.prod_env.aws_cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [module.prod_env]

}
