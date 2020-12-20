#!/bin/bash

api_base_url="${API_URL:-http://localhost:8081/v1}"
if [ $# -eq 1 ]; then
  url="$1"
  method="GET"
  data=""
elif [ $# -eq 2 ]; then
  method="$1"
  url="$2"
  data=""
else
  method="$1"
  url="$2"
  data="$3"
fi

curl -s -X "$method" \
  -H "Content-Type: application/json" \
  -H "Authorization: $(cat credential)" \
  -H "Origin: https://curl.localhost" \
  "${api_base_url}$url" \
  -d "$data" \
  -v
