resource "aws_dynamodb_table" "database" {
  name          = local.domain_name
  billing_mode  = "PAY_PER_REQUEST"
  hash_key      = "record_type"
  range_key     = "id"

  attribute {
    name = "record_type"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}
