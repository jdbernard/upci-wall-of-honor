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
  project_bucket_id = data.terraform_remote_state.global.outputs.aws_s3_project_bucket.id
  route53_zone = data.terraform_remote_state.global.outputs.aws_route53_prod_zone
  additional_cloudfront_aliases = ["upciwallofhonor.org"]
}
